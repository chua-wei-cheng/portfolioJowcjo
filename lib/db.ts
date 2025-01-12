import { Client, Databases, ID, Query } from 'appwrite'

const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const APPWRITE_APIKEY = process.env.NEXT_PUBLIC_APPWRITE_APIKEY

console.log('APPWRITE_PROJECT_ID:', APPWRITE_PROJECT_ID)
console.log('APPWRITE_ENDPOINT:', APPWRITE_ENDPOINT)
console.log('APPWRITE_DATABASE_ID:', APPWRITE_DATABASE_ID)

if (!APPWRITE_PROJECT_ID || !APPWRITE_ENDPOINT || !APPWRITE_DATABASE_ID) {
  console.error('Some Appwrite environment variables are not set or undefined. APPWRITE_PROJECT_ID:', APPWRITE_PROJECT_ID, 'APPWRITE_ENDPOINT:', APPWRITE_ENDPOINT, 'APPWRITE_DATABASE_ID:', APPWRITE_DATABASE_ID)
  throw new Error('Appwrite environment variables are not set correctly')
}

const client = new Client()

client.setEndpoint(APPWRITE_ENDPOINT)
client.setProject(APPWRITE_PROJECT_ID)

const databases = new Databases(client)

export const db = {
  async query(collectionId: string, queries: any[] = []) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        collectionId,
        queries
      )
      return response.documents
    } catch (error: any) {
      console.error('Database query error:', error.message, error.code)
      throw error
    }
  },

  async create(collectionId: string, data: any, permissions: string[] = []) {
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        ID.unique(),
        data,
        permissions
      )
      return response
    } catch (error: any) {
      console.error('Database create error:', error.message, error.code)
      throw error
    }
  },

  async update(collectionId: string, documentId: string, data: any) {
    try {
      const response = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId,
        data
      )
      return response
    } catch (error: any) {
      console.error('Database update error:', error.message, error.code)
      throw error
    }
  },

  async delete(collectionId: string, documentId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId
      )
      return true
    } catch (error: any) {
      console.error('Database delete error:', error.message, error.code)
      throw error
    }
  }
}

