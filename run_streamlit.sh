#!/usr/bin/env bash
# Script para instalar dependencias y ejecutar la aplicación Streamlit CRISP-DM
set -e

echo "======================================================================"
echo "M-3 MINING ENGINE: MOTOR PYTHON EN STREAMLIT (METODOLOGÍA CRISP-DM)"
echo "======================================================================"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 no está instalado en el sistema."
    exit 1
fi

echo "1. Instalando dependencias de Python (requirements.txt)..."
python3 -m pip install -r streamlit_app/requirements.txt || pip install -r streamlit_app/requirements.txt || pip3 install -r streamlit_app/requirements.txt

echo "2. Iniciando servidor de Streamlit en el puerto 8501..."
python3 -m streamlit run streamlit_app/app.py --server.port 8501 --server.address 0.0.0.0
