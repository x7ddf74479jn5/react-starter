import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import { db, getConverter } from "@/lib/firebase";
import type { Book } from "@/models/book";
import { bookSchema } from "@/models/book";

const bookConverter = getConverter<Book>(bookSchema.parse);

export const addBook = async (book: Book) => {
  const docRef = doc(db, "books", book.id).withConverter(bookConverter);
  await setDoc(docRef, book);
};

export const getBooks = async () => {
  const collRef = collection(db, "books").withConverter(bookConverter);
  const snapshot = await getDocs(collRef);
  return snapshot.docs.map((doc) => doc.data());
};
