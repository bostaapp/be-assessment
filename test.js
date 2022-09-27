import fetch from "node-fetch";

const dot = async () => {
  try {
    const url = new URL(
      "http://www.google.com/path/index.html?message=hello&who=world"
    );
    console.log(url);
    // console.log(url.protocol);
    // console.log(url.host);
    // console.log(url.hostname);
    // console.log(url.port);
    console.log(url);
    const response = await fetch("http://google.com/");
    // console.log(response.status);
  } catch (error) {
    // console.log(error);
  }
};

dot();
