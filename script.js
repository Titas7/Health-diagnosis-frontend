window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("upload-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById("image");
        const outputDiv = document.getElementById("result");

        if (fileInput.files.length === 0) {
            outputDiv.innerHTML = "<p class='error'>Please select an image to upload.</p>";
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Server error. Please try again.");
            }

            const data = await response.json();

            let confidenceColor;
            if (data.confidence >= 75) {
                confidenceColor = "green";
            } else if (data.confidence >= 50) {
                confidenceColor = "orange";
            } else {
                confidenceColor = "red";
            }

            outputDiv.innerHTML = `
                <h3>Diagnosis Result:</h3>
                <p><strong>Condition:</strong> ${data.diagnosis}</p>
                <p><strong>Confidence:</strong> <span style="color:${confidenceColor};">${data.confidence}%</span></p>
                <p><em>The confidence score reflects how sure the AI is about the diagnosis. Higher confidence indicates a stronger match between your image and the detected condition.</em></p>

                <div class="legend">
                    <h4>Diagnosis Guide:</h4>
                    <ul>
                        <li><strong>Class A:</strong> Healthy</li>
                        <li><strong>Class B:</strong> Mild Disease</li>
                        <li><strong>Class C:</strong> Moderate Disease</li>
                        <li><strong>Class D:</strong> Severe Condition – Seek medical help</li>
                    </ul>
                    <p><strong>Note:</strong> This is an AI-based prediction. Please consult a medical professional for final diagnosis.</p>
                </div>
            `;

            outputDiv.style.display = "block";
        } catch (error) {
            outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
            outputDiv.style.display = "block";
        }
    });
});
