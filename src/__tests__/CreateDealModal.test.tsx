import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateDealModal from "@/components/CreateDealModal";
import { useDealStore } from "@/store/useDealStore";

jest.mock("@/store/useDealStore");

describe("CreateDealModal", () => {
  const mockAddDeal = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock store return
    (useDealStore as unknown as jest.Mock).mockReturnValue({
      addDeal: mockAddDeal,
      clients: [{ id: 1, name: "Client A" }],
      products: [{ id: 1, name: "Product A" }],
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly when isOpen is true", () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByRole("heading", { name: /Create Deal/i })).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /Create Deal/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables the submit button when required fields are filled", () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Client/i), { target: { value: "Client A" } });
    fireEvent.change(screen.getByLabelText(/Product/i), { target: { value: "Product A" } });

    const submitButton = screen.getByRole("button", { name: /Create Deal/i });
    expect(submitButton).toBeEnabled();
  });

  it("shows alert when submitting with missing required fields", () => {
    render(<CreateDealModal isOpen={true} onClose={jest.fn()} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(window.alert).toHaveBeenCalledWith("All fields are required");
  });

  it("calls addDeal and onClose on successful submission", async () => {
    const onCloseMock = jest.fn();

    render(<CreateDealModal isOpen={true} onClose={onCloseMock} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Client/i), { target: { value: "Client A" } });
    fireEvent.change(screen.getByLabelText(/Product/i), { target: { value: "Product A" } });

    const submitButton = screen.getByRole("button", { name: /Create Deal/i });
    fireEvent.click(submitButton);

    // Fast-forward setTimeout in component
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockAddDeal).toHaveBeenCalledWith(
        expect.objectContaining({
          clientName: "Client A",
          productName: "Product A",
        })
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
