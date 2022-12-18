import firebase from "firebase";
import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "@firebase/firestore-types";

export class TimestampConverter<T extends DocumentData>
  implements FirestoreDataConverter<DocumentData>
{
  toFirestore(data: DocumentData): DocumentData {
    return data;
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): T {
    const data = snapshot.data();

    const convert = (data: unknown) => {
      if (data instanceof firebase.firestore.Timestamp) {
        return data.toDate();
      } else if (typeof data === "object") {
        const wrapped: { [key: string]: any } = Object.assign(
          Array.isArray(data) ? [] : {},
          data
        );
        Object.keys(wrapped).forEach((key) => {
          wrapped[key] = convert(wrapped[key]);
        });
        return wrapped;
      } else {
        return data;
      }
    };

    const converted = Object.keys(data).reduce<DocumentData>((all, key) => {
      all[key] = convert(data[key]);
      return all;
    }, {});

    return converted as T;
  }
}
