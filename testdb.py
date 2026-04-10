from google.cloud import firestore

db = firestore.Client(project='mnemosyne-492716', database='link-saver')

data = {
    "type": "travel",
    "content": "aesthetic beach cafe in Goa",
    "tags": ["cafe", "sunset"],
    "location": "Goa"
}

docRef=db.collection("links").document() 
docRef.set(data)
print("Firestore working!")
