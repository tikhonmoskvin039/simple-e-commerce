import React from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import PageContent from "./components/PageContent/PageContent";

function App() {
  return (
    <div className="App">
      <Header />
      <PageContent />
      <Footer />
    </div>
  );
}



export default App;
