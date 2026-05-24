// src/Components/LoadingSpinner.jsx
import React from "react";


const LoadingSpinner = () => {
  return (
    <div>
      <Container>
        <Lottie
        animationData={ErrorAnimation1}
        loop={true}
        style={{ width: "400px", height: "400px", margin: "0 auto" }}
      />
      </Container>
    </div>
  );
};

export default LoadingSpinner;
