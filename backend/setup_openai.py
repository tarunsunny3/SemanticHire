from elasticsearch import Elasticsearch, NotFoundError, helpers
import json
from es_utils import get_es_client

def create_open_ai_index(inputs):
    es.indices.delete(index=model_index_name, ignore_unavailable=True)
    
    properties = {}
    for field in inputs:
        # Add the embedding field for the input
        properties[f"{field}_embedding"] = {
            "type": "dense_vector",
            "dims": 1536,  # Assuming 1536 dimensions for OpenAI Ada embeddings
            "element_type": "float",
            "similarity": "dot_product"
        }
        # Add the original text field
        properties[field] = {
            "type": "text"
        }
    # print(properties)
    resp = es.indices.create(
    index="openai-embeddings",
    mappings={
        "properties": properties
    },
)
    print(resp)


def create_pipeline_processor(inputs):
    try:
        es.ingest.delete_pipeline(id=pipeline_id)
        print(f"Pipeline '{pipeline_id}' deleted successfully.")
    except NotFoundError:
        print(f"Pipeline '{pipeline_id}' does not exist. No action taken.")

    input_outputs = []
    for input in inputs:
        curr = {
            "input_field": input,
            "output_field": f"{input}_embedding",
        }
        input_outputs.append(curr)
    # print(input_outputs)
    resp = es.ingest.put_pipeline(
        id=pipeline_id,
        processors=[
            {
                "inference": {
                    "model_id": deployed_model_id,
                    "input_output": input_outputs,
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


def search_query(query, input_fields):
    resp = es.search(
    index=model_index_name,
       query={
        "bool": {
            "should": [
                {
                        "match": {
                            "title": query
                        }
                    },
                {
                    "knn": {
                        "field": "description_embedding",
                        "query_vector_builder": {
                            "text_embedding": {
                                "model_id": deployed_model_id,
                                "model_text": query
                            }
                        },
                    }
                },
                    
            ],
             "minimum_should_match": 1 
            
        }
    },
    _source={"excludes": ["description_embedding", "model_id"]}
)


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
    model_index_name = "openai-embeddings"
    json_file = "sample_job_data.json"
    pipeline_id = "openai_embeddings_pipeline"
    deployed_model_id = "openai_embeddings"

    # The field in input data that is used for generating and matching the embeddings
    
    input_field_names = ["description", "title"]
    es = get_es_client()
    # ingest_data()
    # create_open_ai_index(inputs=input_field_names)
    # create_pipeline_processor(inputs=input_field_names)
    # response = reindex_to_model()
    # print(response)
    # task_id = response['task']
    # resp = es.tasks.get(
    #     task_id=task_id,
    # )
    # print(resp)
    search_query("wfdedwefwefewf", input_fields=input_field_names)
