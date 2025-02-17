import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {Dashboard} from "./page"; // import your component
import { generateTopicAPI } from "@/services/generateTextService"; // mock this API

jest.mock("@/services/generateTextService"); // mock the API call

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Mock the API response before each test
    generateTopicAPI.mockResolvedValue({
      questions: {
        FIB: [{ question: "What is 2 + 2?", correctAnswer: "4" }],
        MCQ: [{ question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid"], correctAnswer: "Paris" }],
      },
    });
  });

  test("renders Dashboard correctly", () => {
    render(<Dashboard />);

    // Check if specific elements are in the document
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Quiz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
  });

  test("handles form submission and API call", async () => {
    render(<Dashboard />);

    // Type in the form field
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "JavaScript" } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /Create Quiz/i }));

    // Wait for the API call to finish and check if the questions are rendered
    await waitFor(() => screen.getByText("What is 2 + 2?"));
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  test("handles download button click", async () => {
    render(<Dashboard />);

    // Simulate form submission to trigger the API call
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "JavaScript" } });
    fireEvent.submit(screen.getByRole('button', { name: /Create Quiz/i }));

    // Wait for questions to appear
    await waitFor(() => screen.getByText("What is 2 + 2?"));

    // Simulate download button click
    const downloadButton = screen.getByTitle("Download Quiz");
    fireEvent.click(downloadButton);

    // Expect the download link to be created (check for the URL)
    const downloadLink = document.createElement("a");
    downloadLink.href = expect.any(String); // Check if the URL is valid
    expect(downloadLink).toHaveAttribute("download");
  });

  test("displays error message if subject is empty", async () => {
    render(<Dashboard />);

    // Try submitting an empty form
    fireEvent.submit(screen.getByRole('button', { name: /Create Quiz/i }));

    // Check if the error message is displayed
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
  });
});
