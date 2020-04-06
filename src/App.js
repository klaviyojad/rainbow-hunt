import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase'
import rainbowData from "./data/rainbows.json"



const rainbowDbRef = firebase.database().ref('rainbows')

console.log(rainbowData)

/*
rainbowData.data.map(rainbow => {
  rainbowDbRef.push(rainbow)

}
) */




function App() {
  return (
    <div>

      HELLO RAINBOWS
    </div>
  );
}

export default App;
