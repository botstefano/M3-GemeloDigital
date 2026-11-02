#!/usr/bin/env python3
"""Recalcula estadísticas descriptivas del conjunto público SAG de Constancia.

Entrada: 02_datos_externos_constancia/constancia_sag_table_13_2.csv
Salidas: tablas CSV derivadas y dos figuras descriptivas suplementarias.

Este script no analiza ni ejecuta el motor M-3 y no calibra su ecuación SAG.
"""
from pathlib import Path
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "02_datos_externos_constancia" / "constancia_sag_table_13_2.csv"
OUT = ROOT / "02_datos_externos_constancia" / "resultados_recalculados"
FIG = ROOT / "03_figuras"
OUT.mkdir(parents=True, exist_ok=True)
FIG.mkdir(parents=True, exist_ok=True)

REQUIRED = [
    "survey_no", "grinding_line", "ore_type", "date",
    "feed_size_p80_mm", "sgi_min", "sag_ag_throughput_tph",
    "sag_mill_product_p80_microns",
    "sag_specific_energy_shell_model_kwh_t",
    "sag_specific_energy_shell_plant_kwh_t", "sag_correction_factor",
]


def ci_t(series: pd.Series, confidence: float = 0.95):
    x = pd.to_numeric(series, errors="raise").dropna().astype(float)
    n = len(x)
    mean = float(x.mean())
    sd = float(x.std(ddof=1))
    se = sd / np.sqrt(n)
    critical = float(stats.t.ppf((1 + confidence) / 2, n - 1))
    return mean - critical * se, mean + critical * se


def main():
    df = pd.read_csv(DATA)
    missing = [c for c in REQUIRED if c not in df.columns]
    if missing:
        raise ValueError(f"Faltan columnas requeridas: {missing}")
    if len(df) != 14:
        raise ValueError(f"Se esperaban 14 surveys; se encontraron {len(df)}")
    if df[REQUIRED].isna().any().any():
        raise ValueError("Hay valores ausentes en las columnas requeridas")
    if df["survey_no"].duplicated().any():
        raise ValueError("Hay identificadores de survey duplicados")

    numeric = [
        "feed_size_p80_mm", "sgi_min", "sag_ag_throughput_tph",
        "sag_mill_product_p80_microns",
        "sag_specific_energy_shell_model_kwh_t",
        "sag_specific_energy_shell_plant_kwh_t", "sag_correction_factor",
    ]
    descriptive = []
    for col in numeric:
        x = df[col].astype(float)
        lo, hi = ci_t(x)
        descriptive.append({
            "variable": col,
            "n": len(x),
            "mean": x.mean(),
            "sd_sample": x.std(ddof=1),
            "se": stats.sem(x),
            "cv_pct": x.std(ddof=1) / x.mean() * 100 if x.mean() else np.nan,
            "minimum": x.min(),
            "median": x.median(),
            "maximum": x.max(),
            "ci95_t_lower": lo,
            "ci95_t_upper": hi,
            "ci_assumption": "t de Student; surveys tratados como independientes",
        })
    pd.DataFrame(descriptive).to_csv(OUT / "sag_estadisticas_descriptivas.csv", index=False, float_format="%.6f")

    model = df["sag_specific_energy_shell_model_kwh_t"].astype(float)
    plant = df["sag_specific_energy_shell_plant_kwh_t"].astype(float)
    error = model - plant
    n = len(error)
    bias = float(error.mean())
    sd_error = float(error.std(ddof=1))
    t_bias = float(stats.ttest_1samp(error, 0.0).statistic)
    p_bias = float(stats.ttest_1samp(error, 0.0).pvalue)
    bias_ci = ci_t(error)
    corr = stats.pearsonr(model, plant)
    metrics = [
        ("n_surveys", n, "observaciones pareadas modelo-planta"),
        ("mean_shell_model_kwh_t", model.mean(), "media aritmética"),
        ("mean_shell_plant_kwh_t", plant.mean(), "media aritmética"),
        ("mean_bias_model_minus_plant_kwh_t", bias, "sesgo medio; modelo menos planta"),
        ("sd_paired_difference_kwh_t", sd_error, "desviación estándar muestral de las diferencias"),
        ("bias_ci95_lower_kwh_t", bias_ci[0], "IC t sobre diferencias pareadas; independencia de surveys"),
        ("bias_ci95_upper_kwh_t", bias_ci[1], "IC t sobre diferencias pareadas; independencia de surveys"),
        ("paired_t_statistic", t_bias, "prueba t sobre diferencias pareadas"),
        ("paired_t_p_value", p_bias, "no rechazar H0 no demuestra equivalencia"),
        ("mae_kwh_t", float(np.mean(np.abs(error))), "media del error absoluto"),
        ("rmse_kwh_t", float(np.sqrt(np.mean(error ** 2))), "raíz de la media de errores cuadrados"),
        ("mape_pct", float(np.mean(np.abs(error / plant)) * 100), "porcentaje respecto a Shell Plant"),
        ("pearson_r", float(corr.statistic), "asociación lineal descriptiva"),
        ("pearson_p_value", float(corr.pvalue), "no implica causalidad ni validación predictiva"),
        ("pearson_r_squared", float(corr.statistic ** 2), "cuadrado de la correlación de Pearson"),
        ("max_absolute_error_kwh_t", float(np.max(np.abs(error))), "máximo error absoluto"),
        ("min_nonzero_absolute_error_kwh_t", float(np.min(np.abs(error))), "mínimo error absoluto"),
    ]
    pd.DataFrame(metrics, columns=["metric", "value", "definition_or_caution"]).to_csv(
        OUT / "sag_metricas_modelo_vs_planta.csv", index=False, float_format="%.6f"
    )

    correlations = []
    for col in ["feed_size_p80_mm", "sgi_min", "sag_ag_throughput_tph"]:
        for label, energy in [("shell_model", model), ("shell_plant", plant)]:
            r = stats.pearsonr(df[col].astype(float), energy)
            correlations.append({"variable": col, "energy_series": label, "pearson_r": r.statistic, "p_value_descriptive": r.pvalue})
    pd.DataFrame(correlations).to_csv(OUT / "sag_correlaciones.csv", index=False, float_format="%.6f")

    by_ore = df.assign(_model=model, _plant=plant).groupby("ore_type", sort=True).agg(
        n=("survey_no", "count"),
        shell_model_mean=("_model", "mean"), shell_model_sd=("_model", "std"),
        shell_plant_mean=("_plant", "mean"), shell_plant_sd=("_plant", "std"),
    ).reset_index()
    by_ore.to_csv(OUT / "sag_resumen_por_tipo_mena.csv", index=False, float_format="%.6f")

    hyp = plant[df["ore_type"].eq("Hypogene")].to_numpy()
    sup = plant[df["ore_type"].eq("Supergene")].to_numpy()
    welch = stats.ttest_ind(hyp, sup, equal_var=False)
    nh, ns = len(hyp), len(sup)
    pooled_sd = np.sqrt(((nh - 1) * np.var(hyp, ddof=1) + (ns - 1) * np.var(sup, ddof=1)) / (nh + ns - 2))
    cohen_d = (np.mean(hyp) - np.mean(sup)) / pooled_sd
    correction = 1 - 3 / (4 * (nh + ns) - 9)
    effect = [{
        "comparison": "Hypogene minus Supergene; Shell Plant energy",
        "n_hypogene": nh, "n_supergene": ns,
        "mean_difference_kwh_t": float(np.mean(hyp) - np.mean(sup)),
        "welch_t": float(welch.statistic), "welch_df": float(welch.df), "welch_p": float(welch.pvalue),
        "cohen_d_pooled_sd": float(cohen_d), "hedges_g": float(correction * cohen_d),
        "interpretation": "exploratory; conditional on independence; two lines observed on the same dates",
    }]
    pd.DataFrame(effect).to_csv(OUT / "sag_comparacion_por_mena_exploratoria.csv", index=False, float_format="%.6f")

    date_level = df.assign(_plant=plant).groupby("date", sort=True).agg(
        n_surveys=("survey_no", "count"),
        ore_type=("ore_type", "first"),
        shell_plant_mean_kwh_t=("_plant", "mean"),
    ).reset_index()
    date_level.to_csv(OUT / "sag_resumen_por_fecha.csv", index=False, float_format="%.6f")

    # Figure S1: descriptive scatter, no fitted predictive model.
    fig, ax = plt.subplots(figsize=(7.2, 5.5), constrained_layout=True)
    ax.scatter(model, plant, s=58, alpha=0.85)
    low = float(min(model.min(), plant.min()) - 0.4)
    high = float(max(model.max(), plant.max()) + 0.4)
    ax.plot([low, high], [low, high], linestyle="--", linewidth=1.3, label="Línea de igualdad")
    ax.set(xlim=(low, high), ylim=(low, high),
           xlabel="Energía específica Shell Model (kWh/t)",
           ylabel="Energía específica Shell Plant (kWh/t)",
           title="Constancia: energía específica del modelo y de planta")
    ax.grid(True, alpha=0.25)
    ax.legend(frameon=False)
    ax.text(0.02, 0.98, f"n = {n}; r de Pearson = {corr.statistic:.3f}\nAsociación descriptiva; no es validación de M-3",
            transform=ax.transAxes, va="top", ha="left", fontsize=8,
            bbox={"boxstyle": "round,pad=0.35", "facecolor": "white", "alpha": 0.8, "edgecolor": "0.8"})
    fig.savefig(FIG / "figura_S1_constancia_modelo_vs_planta.png", dpi=300)
    plt.close(fig)

    # Figure S2: paired model/plant values across the 14 published surveys.
    order = np.argsort(pd.to_datetime(df["date"]).to_numpy())
    ordered = df.iloc[order].reset_index(drop=True)
    xm = ordered["sag_specific_energy_shell_model_kwh_t"].astype(float).to_numpy()
    yp = ordered["sag_specific_energy_shell_plant_kwh_t"].astype(float).to_numpy()
    fig, ax = plt.subplots(figsize=(9.2, 5.2), constrained_layout=True)
    xx = np.arange(1, len(ordered) + 1)
    for i, (a, b) in enumerate(zip(xm, yp), start=1):
        ax.plot([i, i], [a, b], linewidth=1.2, alpha=0.65, color="0.55")
    ax.scatter(xx, xm, s=46, label="Shell Model", zorder=3)
    ax.scatter(xx, yp, s=46, marker="s", label="Shell Plant", zorder=3)
    ax.set_xticks(xx, [str(int(s)) for s in ordered["survey_no"]], fontsize=8)
    for boundary in [2.5, 4.5, 6.5, 8.5, 10.5, 12.5]:
        ax.axvline(boundary, color="0.85", linewidth=0.8, zorder=0)
    ax.set(xlabel="Survey (orden cronológico; dos líneas por fecha)", ylabel="Energía específica (kWh/t)",
           title="Constancia: comparación pareada por survey")
    ax.grid(True, axis="y", alpha=0.25)
    ax.legend(frameon=False)
    fig.savefig(FIG / "figura_S2_constancia_diferencias_por_survey.png", dpi=300)
    plt.close(fig)

    print(f"OK: {n} surveys comprobados.")
    print(f"Resultados: {OUT}")
    print(f"Figuras: {FIG}")
    print("Advertencia: las inferencias t y las correlaciones tratan surveys como observaciones; posible dependencia por fecha debe reconocerse.")

if __name__ == "__main__":
    main()
