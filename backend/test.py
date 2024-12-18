from elasticsearch import Elasticsearch, NotFoundError, helpers
import json
from es_utils import get_es_client

def create_google_ai_index(input_field_name):
    es.indices.delete(index=model_index_name, ignore_unavailable=True)
    resp = es.indices.create(
        index=model_index_name,
        mappings={
            "properties": {
                "content_embedding": {
                    "type": "dense_vector",
                    "dims": 768,
                    "element_type": "float",
                    "similarity": "cosine",
                },
                input_field_name: {"type": "text"},
            }
        },
    )
    print(resp)


def create_pipeline_processor(input_field_name, deployed_model_id):
    try:
        es.ingest.delete_pipeline(id=pipeline_id)
        print(f"Pipeline '{pipeline_id}' deleted successfully.")
    except NotFoundError:
        print(f"Pipeline '{pipeline_id}' does not exist. No action taken.")
    resp = es.ingest.put_pipeline(
        id=pipeline_id,
        processors=[
            {
                "inference": {
                    "model_id": deployed_model_id,
                    "input_output": {
                        "input_field": input_field_name,
                        "output_field": "content_embedding",
                    },
                }
            }
        ],
    )
    print(resp)


def ingest_data():
    es.indices.delete(index=data_index_name, ignore_unavailable=True)

    success_count = 0
    actions = []

    with open(json_file, "r") as file:
        data = json.load(file)
        for job in data:
            actions.append({"_index": data_index_name, "_source": job})
            # Upload in batches

            if len(actions) >= 10:
                print("Yes")
                success, _ = helpers.bulk(es, actions, raise_on_error=False)
                success_count += success
                actions = []

    print(success_count)


def reindex_to_model():
    resp = es.reindex(
        wait_for_completion=True,
        source={"index": data_index_name, "size": 50},
        dest={"index": model_index_name, "pipeline": pipeline_id},
    )
    return resp


def search_query(query):
    resp = es.search(
        index=model_index_name,
        query={
            "bool": {
                "should": [
                    {
                        "knn": {
                            "field": "content_embedding",
                            "query_vector_builder": {
                                "text_embedding": {
                                    "model_id": deployed_model_id,
                                    "model_text": query,
                                }
                            },
                        }
                    }
                ],
            }
        },
        min_score=0.75,
        _source={
            "excludes": ["content_embedding", "model_id"]  # Exclude the "content_embedding" field
        },
    )

    # hits = resp["hits"]["hits"]
    hits = resp["hits"]["hits"]
    for hit in hits:
        print(f"Score is {hit['_score']}")
        source = hit["_source"]
        print(f"Company Name: {source['company_name']}")
        print(f"Job Title: {source['title']}")
        
        print(source["description"][:30])
        print("\n")



if __name__ == "__main__":
    data_index_name = "jobs-data"
    model_index_name = "job-google-vertex-ai-embeddings"
    json_file = "sample_job_data.json"
    pipeline_id = "google_vertex_ai_embeddings_pipeline"
    deployed_model_id = "google_vertex_ai_embedding"

    # The field in input data that is used for generating and matching the embeddings
    input_field_name = "description"
    
    es = get_es_client()
    # ingest_data()
    # create_google_ai_index(input_field_name="description")
    # create_pipeline_processor("description", deployed_model_id)
    # response = reindex_to_model()
    # print(response)
    # task_id = response['task']
    # resp = es.tasks.get(
    #     task_id=task_id,
    # )
    # print(resp)
    query = "kjdndjdnwjkdkdnw"
    # query = "Fetch all entry level software jobs"
    search_query(query)
