import React, { Component } from "react";

class CreateEstablishment extends Component {
  state = {};
  render() {
    return (
      <div className="background">
        <br />
        <div className="container border post">
          <div className="row">
            <div className="col-sm">
              <div
                style={{
                  position: "absolute",
                  paddingTop: "10px",
                  paddingLeft: "20px"
                }}
              >
                <h2>Create New Establishment</h2>
                <form>
                  <input
                    className="form-control"
                    type="text"
                    required
                    style={{ width: "300px" }}
                    placeholder="Establishment Name"
                  />
                  <br />
                  <input
                    className="form-control"
                    type="text"
                    required
                    style={{ width: "300px" }}
                    placeholder="Location"
                  />
                  <br />
                  <textarea
                    className="form-control"
                    required
                    style={{ width: "700px", height: "200px" }}
                    placeholder="Description"
                  />
                  <br />
                  <input type="file" name="fileToUpload" id="fileToUpload" />
                  <button
                    type="submit"
                    style={{
                      position: "absolute",
                      right: "10px"
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default CreateEstablishment;
