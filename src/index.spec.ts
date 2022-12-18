import firebase from "firebase";
import { TimestampConverter } from "./index";

interface Dummy {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
  object: object;
  array: object[];
}

const dummy: Dummy = {
  string: "hello",
  number: 123,
  boolean: true,
  date: new Date(),
  object: {
    date: new Date(),
    nested: {
      date: new Date(),
    },
  },
  array: [
    {
      date: new Date(),
    },
  ],
};

firebase.initializeApp({
  projectId: "recursive-timestamp-converter",
});

const db = firebase.firestore();
db.useEmulator("localhost", 8080);

describe("TimestampConverter", () => {
  describe("toFirestore", () => {
    const ref = db.collection("toFirestore").doc("test");

    afterAll(async () => {
      await ref.delete();
    });

    it("should convert to firestore", async () => {
      await ref.withConverter(new TimestampConverter<Dummy>()).set(dummy);

      const snapshot = await ref.get();
      expect(snapshot.exists).toEqual(true);

      const data = snapshot.data()!;
      expect(data.string).toEqual(dummy.string);
      expect(data.number).toEqual(dummy.number);
      expect(data.boolean).toEqual(dummy.boolean);
      expect(data.date).toBeInstanceOf(firebase.firestore.Timestamp);
      expect(data.object.date).toBeInstanceOf(firebase.firestore.Timestamp);
      expect(data.object.nested.date).toBeInstanceOf(
        firebase.firestore.Timestamp
      );
      expect(data.array).toHaveLength(1);
      expect(data.array[0].date).toBeInstanceOf(firebase.firestore.Timestamp);
    });
  });

  describe("fromFirestore", () => {
    const ref = db.collection("fromFirestore").doc("test");

    beforeAll(async () => {
      await ref.set(dummy);
    });

    afterAll(async () => {
      await ref.delete();
    });

    it("should convert from firestore", async () => {
      const snapshot = await ref
        .withConverter(new TimestampConverter<Dummy>())
        .get();
      expect(snapshot.exists).toEqual(true);

      const data = snapshot.data();
      expect(data).toEqual(dummy);
    });
  });
});
