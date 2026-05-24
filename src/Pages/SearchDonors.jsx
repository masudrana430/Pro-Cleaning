// src/pages/SearchDonors.jsx
import { useState } from "react";
import bdLocations from "../data/bdLocations.json";
import Container from "../Components/Container";

const API_BASE = "http://localhost:3000";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchDonors = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [searched, setSearched] = useState(false);

  const districts = bdLocations.map((d) => d.district);

  const selectedDistrictObj = bdLocations.find(
    (d) => d.district === district
  );
  const upazilaOptions = selectedDistrictObj ? selectedDistrictObj.upazilas : [];

  const handleDistrictChange = (value) => {
    setDistrict(value);
    setUpazila("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setDonors([]);
    setSearched(false);

    if (!bloodGroup || !district || !upazila) {
      setErr("Please select blood group, district and upazila.");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        bloodGroup,
        district,
        upazila,
      });

      const res = await fetch(`${API_BASE}/donors/search?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to search donors.");
      }

      const data = await res.json();
      setDonors(data || []);
      setSearched(true);
    } catch (error) {
      console.error(error);
      setErr(error.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* page header */}
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Donor Directory
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
            Find a Blood Donor Near You
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Search by blood group, district and upazila to connect with
            available donors in just a few seconds.
          </p>
        </div>

        {/* main layout: left form, right results */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* left: search form card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-7">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Filter donors
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Choose a blood group and location to start your search.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Blood Group
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full rounded-xl"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full rounded-xl"
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Upazila
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full rounded-xl"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    disabled={!district}
                  >
                    <option value="">
                      {district ? "Select upazila" : "Select district first"}
                    </option>
                    {upazilaOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {err && (
                  <p className="text-error text-xs mt-1">{err}</p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="btn w-full md:w-auto rounded-full border-0
                      bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316]
                      text-white font-semibold shadow-lg shadow-red-300/60
                      hover:shadow-red-400/80 transition"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search donors"}
                  </button>
                </div>
              </form>

              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                Tip: Start with the exact hospital area (e.g.{" "}
                <span className="font-medium">Dhaka – Dhanmondi</span>) for
                faster responses.
              </div>
            </div>
          </div>

          {/* right: results list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-7 min-h-[260px]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Matching donors
                  </h2>
                  <p className="text-xs text-slate-500">
                    We only show donors that match your selected filters.
                  </p>
                </div>

                {searched && (
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {donors.length > 0
                        ? `${donors.length} donor${
                            donors.length > 1 ? "s" : ""
                          } found`
                        : "No donors found"}
                    </span>
                  </div>
                )}
              </div>

              {!searched && !loading && (
                <div className="h-40 flex items-center justify-center text-sm text-slate-500">
                  Start by selecting a blood group, district and upazila.
                </div>
              )}

              {loading && (
                <div className="h-40 flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
                  <span className="loading loading-spinner loading-md" />
                  Searching nearby donors…
                </div>
              )}

              {!loading && searched && donors.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
                  <p>No donors found for this combination.</p>
                  <p className="text-xs">
                    Try a nearby upazila or broaden your district.
                  </p>
                </div>
              )}

              {!loading && donors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donors.map((d) => (
                    <div
                      key={d._id}
                      className="group rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/70 shadow-sm hover:shadow-lg transition overflow-hidden"
                    >
                      <div className="card-body flex flex-row items-center gap-4 py-4">
                        <div className="avatar">
                          <div className="w-14 h-14 rounded-full ring-2 ring-red-200 ring-offset-[3px] ring-offset-white overflow-hidden bg-base-200">
                            {d.avatar ? (
                              <img src={d.avatar} alt={d.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-slate-600">
                                {(d.name || "U")[0]}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                              {d.name || "Unknown donor"}
                            </h3>
                            <span className="badge badge-lg border-0 text-[11px] font-bold text-white bg-gradient-to-r from-[#DC2626] to-[#F97316]">
                              {d.bloodGroup}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {d.email}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              {d.district}, {d.upazila}
                            </span>
                            {d.status && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {d.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="h-1 bg-gradient-to-r from-red-400/80 via-rose-400/60 to-sky-400/60 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SearchDonors;
