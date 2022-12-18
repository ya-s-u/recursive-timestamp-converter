# recursive-timestamp-converter

## Installation

```sh
$ yarn add recursive-timestamp-converter
```

## Usage

```js
import { TimestampConverter } from 'recursive-timestamp-converter';

const snapshot = await firestore
  .collection("posts")
  .doc(id)
  .withConverter(new TimestampConverter<Post>())
  .get();
```
