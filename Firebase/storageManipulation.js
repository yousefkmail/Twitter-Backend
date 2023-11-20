const { initializeApp } = require("firebase/app");
const {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} = require("firebase/storage");

const ConnectToFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBCseOFiqcAfK7Z1IDOFo581fRTxnxe_iY",
    authDomain: "twitter-329ce.firebaseapp.com",
    projectId: "twitter-329ce",
    storageBucket: "twitter-329ce.appspot.com",
    messagingSenderId: "963926884272",
    appId: "1:963926884272:web:998adc4089a3927b362075",
  };
  initializeApp(firebaseConfig);
};

const UploadFileToFirebase = async (fileName, file) => {
  const storage = getStorage();
  const mountainsRef = ref(storage, fileName);
  var metadata = { contentType: "image/jpeg" };

  await uploadBytes(mountainsRef, file, metadata);

  getDownloadURL(mountainsRef).then((res) => {});
};

const UploadImageTofirebase = async (filename, tweetId, uploaderid, file) => {
  const storage = getStorage();
  const imageref = ref(
    storage,
    "images/" + uploaderid + "/" + tweetId + "/" + filename
  );
  var metadata = { contentType: "image/jpeg" };
  await uploadBytes(imageref, file, metadata);

  const url = await getDownloadURL(imageref);
  return url;
};

module.exports = {
  ConnectToFirebase,
  UploadFileToFirebase,
  UploadImageTofirebase,
};
