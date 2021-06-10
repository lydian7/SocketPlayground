class Request {
  constructor() {
    this.baseUrl = "http://localhost:8080/messages";
  }

  getAll = () => {
    return fetch(this.baseUrl).then((res) => res.json());
  };

  post = (payload) => {
    return fetch(this.baseUrl, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };
}

export default Request;
