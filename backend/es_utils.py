from dotenv import load_dotenv
import os
from elasticsearch import Elasticsearch

# Load environment variables from .env file
load_dotenv()
class ElasticSearchClient:
    """Singleton Class to Manage Elasticsearch Client"""

    _instance = None

    @staticmethod
    def get_instance():
        """Retrieve the Singleton Elasticsearch instance"""
        if ElasticSearchClient._instance is None:
            ElasticSearchClient()
        return ElasticSearchClient._instance

    def __init__(self):
        """Initialize Elasticsearch client"""
        if ElasticSearchClient._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            elastic_cloud_id = os.getenv('ELASTIC_CLOUD_ID')
            elastic_api_key = os.getenv('ELASTIC_API_KEY')

            

            self.client = Elasticsearch(
                cloud_id=elastic_cloud_id,
                api_key=elastic_api_key
            )
            ElasticSearchClient._instance = self.client

# Utility function to retrieve the ES client
def get_es_client():
    return ElasticSearchClient.get_instance()
