import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import json
import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Page configuration
st.set_page_config(
    page_title="DataSense AI",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS matching your React UI design
st.markdown("""
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .main {
        background-color: #f8fafc;
        padding: 0;
    }
    
    .stApp {
        background-color: #f8fafc;
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #ffffff;
        border-right: 1px solid rgba(148, 163, 184, 0.4);
        width: 288px;
    }
    
    section[data-testid="stSidebar"] > div {
        padding: 2rem 1rem;
    }
    
    /* Main Content Area */
    .main-content {
        background-color: #f8fafc;
        padding: 2rem;
        border-radius: 1rem;
    }
    
    /* Header Styling */
    .header {
        margin-bottom: 2rem;
    }
    
    .header h1 {
        font-size: 2rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0.5rem;
    }
    
    .header p {
        color: #64748b;
        font-size: 1rem;
    }
    
    /* Card Styling */
    .card {
        background-color: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.8);
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    /* Button Styling */
    .stButton > button {
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background-color: #5568d3;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    /* Tab Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 1rem;
        border-bottom: 2px solid #e2e8f0;
    }
    
    .stTabs [aria-selected="true"] {
        border-bottom: 3px solid #667eea;
        color: #667eea;
    }
    </style>
    """, unsafe_allow_html=True)

# Initialize session state
if "data" not in st.session_state:
    st.session_state.data = None
if "schema" not in st.session_state:
    st.session_state.schema = None
if "messages" not in st.session_state:
    st.session_state.messages = []
if "active_tab" not in st.session_state:
    st.session_state.active_tab = "upload"

def get_dataframe_schema(df):
    """Extract schema information from dataframe"""
    return {
        "columns": list(df.columns),
        "types": {col: str(df[col].dtype) for col in df.columns},
        "totalRows": len(df),
        "totalColumns": len(df.columns),
        "nullCounts": {col: int(df[col].isnull().sum()) for col in df.columns}
    }

def analyze_with_gemini(data_context, user_query):
    """Use Gemini API to analyze data"""
    if not API_KEY:
        return "Error: GEMINI_API_KEY not configured"
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        prompt = f"""
You are a data analysis expert. Based on the following dataset context and user query, provide insights.

Dataset Context:
{json.dumps(data_context, indent=2)}

User Query: {user_query}

Provide a comprehensive analysis with key findings and recommendations.
"""
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error analyzing data: {str(e)}"

# Sidebar Navigation
with st.sidebar:
    st.markdown("### 📊 DataSense AI", help="AI-Powered Data Analytics")
    st.divider()
    
    nav_items = {
        "upload": "📁 Data Ingest",
        "dashboard": "📊 Control Center",
        "chat": "💬 Neural Chat",
        "advanced": "📈 Advanced",
        "guide": "📖 Logic Hub",
    }
    
    st.session_state.active_tab = st.radio(
        "Navigation",
        list(nav_items.keys()),
        format_func=lambda x: nav_items[x],
        label_visibility="collapsed"
    )
    
    st.divider()
    
    if st.session_state.data is not None:
        st.markdown("### 📊 Data Summary")
        col1, col2 = st.columns(2)
        col1.metric("Rows", st.session_state.schema["totalRows"])
        col2.metric("Columns", st.session_state.schema["totalColumns"])
        
        if st.button("🔄 Reset Data", use_container_width=True):
            st.session_state.data = None
            st.session_state.schema = None
            st.session_state.messages = []
            st.session_state.active_tab = "upload"
            st.rerun()

# Main Content
st.markdown('<div class="main-content">', unsafe_allow_html=True)

if st.session_state.active_tab == "upload":
    st.markdown('<div class="header"><h1>📁 Data Ingest</h1><p>Upload your dataset and start exploring</p></div>', unsafe_allow_html=True)
    
    st.markdown('<div class="card">', unsafe_allow_html=True)
    uploaded_file = st.file_uploader(
        "Choose a CSV or Excel file",
        type=["csv", "xlsx", "xls"],
        label_visibility="collapsed"
    )
    st.markdown('</div>', unsafe_allow_html=True)
    
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith('.csv'):
                df = pd.read_csv(uploaded_file)
            else:
                df = pd.read_excel(uploaded_file)
            
            st.session_state.data = df
            st.session_state.schema = get_dataframe_schema(df)
            
            st.success(f"✅ Dataset loaded! {len(df)} rows × {len(df.columns)} columns")
            
            with st.expander("📋 Data Preview", expanded=True):
                st.dataframe(df.head(10), use_container_width=True)
            
            with st.expander("📊 Schema Information"):
                schema = st.session_state.schema
                col1, col2, col3 = st.columns(3)
                col1.metric("Total Rows", schema["totalRows"])
                col2.metric("Total Columns", schema["totalColumns"])
                col3.metric("Missing Values", sum(schema["nullCounts"].values()))
                
                st.write("**Column Details:**")
                for col in schema["columns"]:
                    null_count = schema["nullCounts"][col]
                    col_type = schema["types"][col]
                    st.write(f"• **{col}** ({col_type}) - {null_count} nulls")
        
        except Exception as e:
            st.error(f"Error loading file: {str(e)}")

elif st.session_state.active_tab == "dashboard":
    if st.session_state.data is not None:
        st.markdown('<div class="header"><h1>📊 Control Center</h1><p>Interactive data exploration and visualization</p></div>', unsafe_allow_html=True)
        
        df = st.session_state.data
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Overview Metrics
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Records", len(df))
        col2.metric("Columns", len(df.columns))
        col3.metric("Missing Data", f"{(df.isnull().sum().sum() / (len(df) * len(df.columns)) * 100):.1f}%")
        col4.metric("Memory", f"{df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")
        
        st.divider()
        
        # Visualization Builder
        st.markdown("### 🎨 Visualization Builder")
        
        chart_type = st.selectbox("Chart Type", ["scatter", "bar", "line", "histogram"], key="chart_type")
        
        if chart_type == "histogram":
            if numeric_cols:
                x_col = st.selectbox("Column", numeric_cols, key="hist_col")
                fig = px.histogram(df, x=x_col, nbins=30, title=f"Distribution of {x_col}")
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No numeric columns available for histogram")
        else:
            if numeric_cols and len(numeric_cols) > 1:
                col_a, col_b = st.columns(2)
                with col_a:
                    x_col = st.selectbox("X Axis", numeric_cols, key="x_axis")
                with col_b:
                    y_col = st.selectbox("Y Axis", numeric_cols, key="y_axis")
                
                if chart_type == "scatter":
                    fig = px.scatter(df, x=x_col, y=y_col, title=f"{x_col} vs {y_col}")
                elif chart_type == "bar":
                    fig = px.bar(df, x=x_col, y=y_col, title=f"{x_col} by {y_col}")
                else:  # line
                    fig = px.line(df, x=x_col, y=y_col, title=f"{x_col} over {y_col}")
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Need at least 2 numeric columns for this chart type")

    else:
        st.info("📁 Please upload a dataset first")

elif st.session_state.active_tab == "chat":
    if st.session_state.data is not None:
        st.markdown('<div class="header"><h1>💬 Neural Chat</h1><p>Ask questions about your data</p></div>', unsafe_allow_html=True)
        
        # Display chat messages
        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]):
                st.write(msg["content"])
        
        # Chat input
        user_input = st.chat_input("Ask me about your data...")
        
        if user_input:
            st.session_state.messages.append({"role": "user", "content": user_input})
            
            with st.chat_message("user"):
                st.write(user_input)
            
            with st.spinner("Analyzing..."):
                data_context = {
                    "schema": st.session_state.schema,
                    "sampleData": st.session_state.data.head(5).to_dict()
                }
                response = analyze_with_gemini(data_context, user_input)
                st.session_state.messages.append({"role": "assistant", "content": response})
            
            with st.chat_message("assistant"):
                st.write(response)
    
    else:
        st.info("📁 Please upload a dataset first")

elif st.session_state.active_tab == "advanced":
    if st.session_state.data is not None:
        st.markdown('<div class="header"><h1>📈 Advanced Analytics</h1><p>Deep data exploration</p></div>', unsafe_allow_html=True)
        
        df = st.session_state.data
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        tab1, tab2, tab3 = st.tabs(["Correlations", "Distributions", "Summary Stats"])
        
        with tab1:
            if numeric_cols:
                corr_matrix = df[numeric_cols].corr()
                fig = px.imshow(corr_matrix, color_continuous_scale="RdBu", zmin=-1, zmax=1, title="Correlation Matrix")
                st.plotly_chart(fig, use_container_width=True)
        
        with tab2:
            selected_cols = st.multiselect("Select columns", numeric_cols, default=numeric_cols[:2] if numeric_cols else [])
            for col in selected_cols:
                fig = px.histogram(df, x=col, nbins=30, title=f"Distribution of {col}")
                st.plotly_chart(fig, use_container_width=True)
        
        with tab3:
            st.dataframe(df.describe(), use_container_width=True)
    
    else:
        st.info("📁 Please upload a dataset first")

elif st.session_state.active_tab == "guide":
    st.markdown('<div class="header"><h1>📖 Logic Hub</h1><p>Learn how to use DataSense AI</p></div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 🚀 Getting Started
        
        1. **Data Ingest** - Upload your CSV or Excel file
        2. **Control Center** - Create visualizations
        3. **Neural Chat** - Ask AI questions
        4. **Advanced** - Deep analysis
        """)
    
    with col2:
        st.markdown("""
        ### 💡 Features
        
        - 📊 Interactive dashboards
        - 🤖 AI-powered analysis
        - 📈 Advanced visualizations
        - 💬 Natural language queries
        """)

st.markdown('</div>', unsafe_allow_html=True)
