from flask import Flask, request, jsonify

from es_utils import get_es_client
from flask_cors import CORS


# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS globally

# Constants
DATA_INDEX_NAME = "jobs-data"
MODEL_INDEX_NAME = "job-google-vertex-ai-embeddings"
PIPELINE_ID = "google_vertex_ai_embeddings_pipeline"
DEPLOYED_MODEL_ID = "google_vertex_ai_embedding"
INPUT_FIELD_NAME = "description"
JSON_FILE = "sample_job_data.json"


es = get_es_client()

# Public Search Endpoint
@app.route('/jobs/search', methods=['POST'])
def search():
    try:
        user_query = request.json.get("query_text", "")

        # Perform search
        resp = es.search(
            index=MODEL_INDEX_NAME,
            query={
                "bool": {
                    "must": [
                        {
                            "knn": {
                                "field": "content_embedding",
                                "query_vector_builder": {
                                    "text_embedding": {
                                        "model_id": DEPLOYED_MODEL_ID,
                                        "model_text": user_query
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            min_score=0.75,
            _source={"excludes": ["content_embedding", "model_id"]}
        )

       
        if 'hits' not in resp or 'hits' not in resp['hits']:
            return jsonify({"status": "success", "results": []})
        
        hits = resp['hits']['hits']
        results = [hit['_source'] for hit in hits]
        print(len(results))

        return jsonify({"status": "success", "results": results})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



# Start the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
