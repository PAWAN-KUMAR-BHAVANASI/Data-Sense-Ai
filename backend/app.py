"""
Flask API for Seaborn Dashboard Generation
Serves statistical visualizations and data analysis
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configure matplotlib for non-GUI backend
plt.switch_backend('Agg')

# Set Seaborn style
sns.set_theme(style="whitegrid")
sns.set_palette("husl")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/api/upload', methods=['POST'])
def upload_data():
    """
    Upload and parse CSV/Excel data
    Returns schema and basic statistics
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Read file based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400
        
        # Generate schema
        schema = {
            'columns': df.columns.tolist(),
            'dtypes': {col: str(df[col].dtype) for col in df.columns},
            'shape': list(df.shape),
            'sample': df.head().to_dict(orient='records')
        }
        
        # Basic statistics
        stats = {
            'numeric_columns': df.select_dtypes(include=[np.number]).columns.tolist(),
            'categorical_columns': df.select_dtypes(include=['object']).columns.tolist(),
            'missing_values': df.isnull().sum().to_dict()
        }
        
        # Store in session (in production, use database)
        return jsonify({
            'schema': schema,
            'stats': stats,
            'message': 'File uploaded successfully'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/heatmap', methods=['POST'])
def generate_heatmap():
    """Generate correlation heatmap"""
    try:
        data = request.get_json()
        
        # Parse data into DataFrame
        df = pd.DataFrame(data['data'])
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.empty:
            return jsonify({'error': 'No numeric columns found'}), 400
        
        # Create heatmap
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(
            numeric_df.corr(),
            annot=True,
            fmt='.2f',
            cmap='coolwarm',
            center=0,
            square=True,
            ax=ax,
            cbar_kws={'label': 'Correlation'}
        )
        ax.set_title('Correlation Heatmap', fontsize=16, fontweight='bold')
        
        # Convert to base64
        img_base64 = fig_to_base64(fig)
        plt.close(fig)
        
        return jsonify({'plot': img_base64}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/distribution', methods=['POST'])
def generate_distribution():
    """Generate distribution plots"""
    try:
        data = request.get_json()
        df = pd.DataFrame(data['data'])
        column = data.get('column')
        
        if column not in df.columns:
            return jsonify({'error': f'Column {column} not found'}), 400
        
        # Create subplots
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        
        # Histogram
        sns.histplot(df[column].dropna(), kde=True, ax=axes[0], color='steelblue')
        axes[0].set_title(f'Distribution of {column}', fontsize=14, fontweight='bold')
        axes[0].set_xlabel(column)
        axes[0].set_ylabel('Frequency')
        
        # Box plot
        sns.boxplot(y=df[column].dropna(), ax=axes[1], color='lightblue')
        axes[1].set_title(f'Box Plot of {column}', fontsize=14, fontweight='bold')
        axes[1].set_ylabel(column)
        
        fig.tight_layout()
        img_base64 = fig_to_base64(fig)
        plt.close(fig)
        
        return jsonify({'plot': img_base64}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/scatter', methods=['POST'])
def generate_scatter():
    """Generate scatter plot with regression line"""
    try:
        data = request.get_json()
        df = pd.DataFrame(data['data'])
        x_col = data.get('x')
        y_col = data.get('y')
        hue_col = data.get('hue')
        
        if x_col not in df.columns or y_col not in df.columns:
            return jsonify({'error': 'Invalid columns'}), 400
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        sns.scatterplot(
            data=df,
            x=x_col,
            y=y_col,
            hue=hue_col if hue_col and hue_col in df.columns else None,
            s=100,
            alpha=0.6,
            ax=ax
        )
        
        # Add regression line
        sns.regplot(
            data=df,
            x=x_col,
            y=y_col,
            scatter=False,
            line_kws={'color': 'red', 'linewidth': 2},
            ax=ax
        )
        
        ax.set_title(f'{x_col} vs {y_col}', fontsize=14, fontweight='bold')
        ax.set_xlabel(x_col)
        ax.set_ylabel(y_col)
        
        fig.tight_layout()
        img_base64 = fig_to_base64(fig)
        plt.close(fig)
        
        return jsonify({'plot': img_base64}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/pairplot', methods=['POST'])
def generate_pairplot():
    """Generate pair plot for numeric columns"""
    try:
        data = request.get_json()
        df = pd.DataFrame(data['data'])
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        if len(numeric_cols) < 2:
            return jsonify({'error': 'Need at least 2 numeric columns'}), 400
        
        # Limit to first 4 columns for performance
        cols_to_plot = numeric_cols[:4]
        
        fig = sns.pairplot(
            df[cols_to_plot],
            diag_kind='kde',
            plot_kws={'s': 50, 'alpha': 0.6},
            diag_kws={'shade': True}
        )
        
        img_base64 = fig_to_base64(fig)
        plt.close(fig)
        
        return jsonify({'plot': img_base64}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plots/violin', methods=['POST'])
def generate_violin():
    """Generate violin plot"""
    try:
        data = request.get_json()
        df = pd.DataFrame(data['data'])
        x_col = data.get('x')
        y_col = data.get('y')
        
        if x_col not in df.columns or y_col not in df.columns:
            return jsonify({'error': 'Invalid columns'}), 400
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        sns.violinplot(
            data=df,
            x=x_col,
            y=y_col,
            palette='Set2',
            ax=ax
        )
        
        ax.set_title(f'Distribution of {y_col} by {x_col}', fontsize=14, fontweight='bold')
        
        fig.tight_layout()
        img_base64 = fig_to_base64(fig)
        plt.close(fig)
        
        return jsonify({'plot': img_base64}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analysis/summary', methods=['POST'])
def statistical_summary():
    """Generate statistical summary"""
    try:
        data = request.get_json()
        df = pd.DataFrame(data['data'])
        
        numeric_df = df.select_dtypes(include=[np.number])
        
        summary = {
            'count': numeric_df.shape[0],
            'mean': numeric_df.mean().to_dict(),
            'median': numeric_df.median().to_dict(),
            'std': numeric_df.std().to_dict(),
            'min': numeric_df.min().to_dict(),
            'max': numeric_df.max().to_dict(),
            'correlation': numeric_df.corr().to_dict()
        }
        
        return jsonify(summary), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def fig_to_base64(fig):
    """Convert matplotlib figure to base64 string"""
    img_buffer = io.BytesIO()
    fig.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
    img_buffer.close()
    return img_base64

if __name__ == '__main__':
    app.run(debug=True, port=5000)
