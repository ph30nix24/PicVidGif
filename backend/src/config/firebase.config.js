import { cart, initializeApp } from 'firebase-admin/app'

export const firebaseApp = initializeApp({
    credential: cart({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    })
})