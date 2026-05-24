// src/pages/FundingPage.jsx
import { useContext, useEffect, useState, useMemo } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AuthContext } from "../Provider/AuthProvider";
import useCurrentUser from "../hooks/useCurrentUser";
import Container from "../Components/Container";
import LoadingSpinner2nd from "../Components/LoadingSpinner2nd";

const API_BASE = "http://localhost:3000";

const FundingPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const { dbUser, loadingDbUser } = useCurrentUser();

  const [amount, setAmount] = useState("");
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [funds, setFunds] = useState([]);
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [errFunds, setErrFunds] = useState("");
  const [showForm, setShowForm] = useState(false);

  // total funding (for display only here)
  const totalAmount = useMemo(
    () => funds.reduce((sum, f) => sum + (Number(f.amount) || 0), 0),
    [funds]
  );

  // Load all funds
  const loadFunds = async () => {
    if (!user) return;
    setLoadingFunds(true);
    setErrFunds("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/funds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load funds.");
      }
      const data = await res.json();
      setFunds(data || []);
    } catch (error) {
      console.error(error);
      setErrFunds(error.message || "Failed to load funds.");
    } finally {
      setLoadingFunds(false);
    }
  };

  useEffect(() => {
    loadFunds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGiveFund = async (e) => {
    e.preventDefault();
    setCardError("");
    setSuccessMsg("");

    if (!stripe || !elements) {
      setCardError("Stripe is not ready yet. Try again in a moment.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setCardError("Card element not found.");
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setCardError("Enter a valid amount greater than 0.");
      return;
    }

    try {
      setProcessing(true);

      const token = await user.getIdToken();

      // 1) Create PaymentIntent on backend
      const piRes = await fetch(`${API_BASE}/create-payment-intent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      if (!piRes.ok) {
        const data = await piRes.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create payment intent.");
      }

      const { clientSecret } = await piRes.json();
      if (!clientSecret) {
        throw new Error("No clientSecret returned from server.");
      }

      // 2) Confirm card payment on client
      const donorName = dbUser?.name || user?.displayName || user?.email;

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: donorName,
              email: user?.email || "",
            },
          },
        }
      );

      if (error) {
        console.error(error);
        setCardError(error.message || "Payment failed.");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setCardError("Payment did not succeed.");
        setProcessing(false);
        return;
      }

      // 3) Save funding record in DB
      const saveRes = await fetch(`${API_BASE}/funds`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          paymentIntentId: paymentIntent.id,
        }),
      });

      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => ({}));
        throw new Error(
          data.message || "Payment succeeded but saving fund failed."
        );
      }

      setSuccessMsg("Thank you! Your fund has been recorded.");
      setAmount("");
      card.clear();
      await loadFunds();
    } catch (error) {
      console.error(error);
      setCardError(error.message || "Funding failed.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleString();
  };

  if (loadingDbUser) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner2nd />
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* header */}
        <div className=" mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Funding
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
                Support the Blood Donation Platform
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                View all contributions and securely add your own funding using
                Stripe test payments.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-xs text-slate-500">
                Total collected so far:
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ${totalAmount.toFixed(2)}
              </div>
              <button
                className="btn btn-sm md:btn-md mt-1 rounded-full border-0
                  bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316]
                  text-white font-semibold shadow-md shadow-red-300/40
                  hover:shadow-red-400/70"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "Close funding form" : "Give Fund"}
              </button>
            </div>
          </div>
        </div>

        {/* layout: form + table */}
        <div className=" grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Give Fund Form card */}
          <div className="lg:col-span-2">
            {showForm && (
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-7">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Give Fund
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Use Stripe test card (e.g. <span className="font-mono">4242 4242 4242 4242</span>) to simulate payments.
                </p>

                <form onSubmit={handleGiveFund} className="space-y-4">
                  <div className="form-control max-w-xs">
                    <label className="label pb-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount (USD)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="input input-bordered w-full rounded-xl"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  <div className="form-control max-w-md">
                    <label className="label pb-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Card Details
                      </span>
                    </label>
                    <div className="border rounded-xl px-3 py-2 bg-slate-50/60">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#111827",
                              "::placeholder": {
                                color: "#9CA3AF",
                              },
                            },
                            invalid: {
                              color: "#EF4444",
                            },
                          },
                        }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Test card: 4242 4242 4242 4242 · any future expiry · any
                      3-digit CVC.
                    </p>
                  </div>

                  {cardError && (
                    <p className="text-error text-sm">{cardError}</p>
                  )}
                  {successMsg && (
                    <p className="text-success text-sm">{successMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="btn mt-1 rounded-full border-0
                      bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316]
                      text-white font-semibold shadow-md shadow-red-300/40
                      hover:shadow-red-400/70"
                    disabled={processing || !stripe || !elements}
                  >
                    {processing ? "Processing..." : "Confirm & Pay"}
                  </button>
                </form>
              </div>
            )}

            {!showForm && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-5 text-sm text-slate-600">
                Click the <span className="font-semibold">Give Fund</span>{" "}
                button above to open the funding form and add a new
                contribution.
              </div>
            )}
          </div>

          {/* Funds table card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Funds
                  </h2>
                  <p className="text-xs text-slate-500">
                    Each entry shows who contributed, how much, and when.
                  </p>
                </div>
                {funds.length > 0 && (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {funds.length} contribution
                    {funds.length > 1 ? "s" : ""} recorded
                  </span>
                )}
              </div>

              {loadingFunds ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner" />
                </div>
              ) : errFunds ? (
                <p className="text-error text-sm">{errFunds}</p>
              ) : funds.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No funds have been recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="table table-zebra-zebra">
                    <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="font-semibold">#</th>
                        <th className="font-semibold">Donor</th>
                        <th className="font-semibold">Email</th>
                        <th className="font-semibold">Amount</th>
                        <th className="font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {funds.map((f, idx) => (
                        <tr key={f._id}>
                          <td>{idx + 1}</td>
                          <td>{f.userName || "Unknown"}</td>
                          <td className="truncate max-w-[180px]">
                            {f.userEmail}
                          </td>
                          <td className="font-semibold text-slate-900">
                            ${Number(f.amount).toFixed(2)}
                          </td>
                          <td className="text-xs text-slate-600">
                            {formatDate(f.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/90 text-xs text-slate-600">
                      <tr>
                        <td colSpan={3} className="text-right font-semibold">
                          Total:
                        </td>
                        <td className="font-bold text-slate-900">
                          ${totalAmount.toFixed(2)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FundingPage;
