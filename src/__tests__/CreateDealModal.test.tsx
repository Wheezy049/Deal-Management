import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateDealModal from "@/components/CreateDealModal";
import { useDealStore } from "@/store/useDealStore";

jest.mock("@/store/useDealStore");

describe("CreateDealModal", () => {
  const mockAddDeal = jest.fn(() => Promise.resolve());
  const mockFetchClients = jest.fn();
  const mockFetchProducts = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useDealStore as unknown as jest.Mock).mockReturnValue({
      addDeal: mockAddDeal,
      fetchClients: mockFetchClients,
      fetchProducts: mockFetchProducts,
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

    // fill client
    fireEvent.change(screen.getByRole("combobox", { name: /Client/i }), {
      target: { value: "Client A" },
    });

    // fill product
    fireEvent.change(screen.getByRole("combobox", { name: /Product/i }), {
      target: { value: "Product A" },
    });

    const submitButton = screen.getByRole("button", { name: /Create Deal/i });
    expect(submitButton).toBeEnabled();
  });

  it("shows alert when submitting with missing required fields", () => {
  render(<CreateDealModal isOpen={true} onClose={jest.fn()} />);

  const form = screen.getByRole("form", { hidden: true });
  fireEvent.submit(form);

  expect(window.alert).toHaveBeenCalledWith("All fields are required");
});



  it("calls addDeal and onClose on successful submission", async () => {
    const onCloseMock = jest.fn();
    render(<CreateDealModal isOpen={true} onClose={onCloseMock} />);

    // fields required
    fireEvent.change(screen.getByRole("combobox", { name: /Client/i }), {
      target: { value: "Client A" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /Product/i }), {
      target: { value: "Product A" },
    });

    const submitButton = screen.getByRole("button", { name: /Create Deal/i });
    fireEvent.click(submitButton);

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
