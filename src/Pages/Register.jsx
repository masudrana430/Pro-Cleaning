import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiDroplet, FiShield, FiMapPin } from "react-icons/fi";
import { AuthContext } from "../Provider/AuthProvider";
import Container from "../Components/Container";

// Your ImgBB API key
const IMGBB_API_KEY = "d2c33ec583acb5f5045c5171be4b23e5";

// TODO: replace with full BD geocode
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// All 64 Districts sorted Alphabetically for easier Dropdown usage
const districtOptions = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", 
  "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", 
  "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", 
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", 
  "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", 
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", 
  "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", 
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", 
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", 
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", 
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", 
  "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

const upazilaOptionsByDistrict = {
  // --- Barishal Division ---
  "Barguna": ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"],
  "Barishal": ["Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barishal Sadar", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
  "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  "Jhalokati": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
  "Patuakhali": ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"],
  "Pirojpur": ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkathi)", "Pirojpur Sadar", "Zianagar (Indurkani)"],

  // --- Chattogram Division ---
  "Bandarban": ["Ali Kadam", "Bandarban Sadar", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
  "Brahmanbaria": ["Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Brahmanbaria Sadar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"],
  "Chandpur": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  "Chattogram": ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda", "Chattogram Sadar"],
  "Cox's Bazar": ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"],
  "Cumilla": ["Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Cumilla Adarsha Sadar", "Cumilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Manoharganj", "Meghna", "Muradnagar", "Nangalkot", "Titas"],
  "Feni": ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
  "Khagrachhari": ["Dighinala", "Guimara", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
  "Lakshmipur": ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
  "Noakhali": ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarnachar"],
  "Rangamati": ["Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kaukhali", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar"],

  // --- Dhaka Division ---
  "Dhaka": ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Tejgaon Circle", "Ramna Circle", "Mirpur Circle", "Dhanmondi Circle", "Gulshan Circle", "Lalbagh Circle"],
  "Faridpur": ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
  "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  "Kishoreganj": ["Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
  "Madaripur": ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar", "Dasar"],
  "Manikganj": ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shivalaya", "Singair"],
  "Munshiganj": ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"],
  "Narayanganj": ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"],
  "Narsingdi": ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
  "Rajbari": ["Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar"],
  "Shariatpur": ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zajira"],
  "Tangail": ["Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar"],

  // --- Khulna Division ---
  "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  "Chuadanga": ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
  "Jashore": ["Abhaynagar", "Bagherpara", "Chaugachha", "Jashore Sadar", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
  "Jhenaidah": ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  "Khulna": ["Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada", "Khulna Sadar"],
  "Kushtia": ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"],
  "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  "Meherpur": ["Gangni", "Meherpur Sadar", "Mujibnagar"],
  "Narail": ["Kalia", "Lohagara", "Narail Sadar"],
  "Satkhira": ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],

  // --- Mymensingh Division ---
  "Jamalpur": ["Bakshiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"],
  "Mymensingh": ["Bhaluka", "Dhobaura", "Fulbaria", "Gafargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha", "Nandail", "Phulpur", "Tara Khanda", "Trishal"],
  "Netrokona": ["Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"],
  "Sherpur": ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"],

  // --- Rajshahi Division ---
  "Bogura": ["Adamdighi", "Bogura Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"],
  "Chapainawabganj": ["Bholahat", "Chapainawabganj Sadar", "Gomastapur", "Nachol", "Shibganj"],
  "Joypurhat": ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
  "Naogaon": ["Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
  "Natore": ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Natore Sadar", "Singra"],
  "Pabna": ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"],
  "Rajshahi": ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
  "Sirajganj": ["Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullahpara"],

  // --- Rangpur Division ---
  "Dinajpur": ["Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
  "Gaibandha": ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
  "Kurigram": ["Bhurungamari", "Char Rajibpur", "Chilmari", "Kurigram Sadar", "Nageshwari", "Phulbari", "Rajarhat", "Raomari", "Ulipur"],
  "Lalmonirhat": ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
  "Nilphamari": ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"],
  "Panchagarh": ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
  "Rangpur": ["Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
  "Thakurgaon": ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"],

  // --- Sylhet Division ---
  "Habiganj": ["Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
  "Moulvibazar": ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
  "Sunamganj": ["Bishwamvarpur", "Chhatak", "Dakshin Sunamganj (Shantiganj)", "Derai", "Dharmapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Madhyanagar", "Sullah", "Sunamganj Sadar", "Tahirpur"],
  "Sylhet": ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Sylhet Sadar", "Zakiganj"]
};

const Register = () => {
  const { createUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [toast, setToast] = useState(null);
  const [show, setShow] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const apiBase = "http://localhost:3000";

  const validatePassword = (pwd) => {
    const issues = [];
    if (pwd.length < 6) issues.push("Password must be at least 6 characters.");
    return issues;
  };

  const uploadAvatarToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key not set in IMGBB_API_KEY constant.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data.success) {
      console.error("ImgBB response:", data);
      throw new Error("ImgBB upload failed. Check API key or request.");
    }

    return data.data.display_url;
  };

  const saveUserToDatabase = async (userData) => {
    const res = await fetch(`${apiBase}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to save user to database.");
    }

    return data;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setPwdErr("");
    setToast(null);

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;
    const avatarFile = form.avatar.files[0];

    if (!avatarFile) {
      const msg = "Please upload an avatar image.";
      setErr(msg);
      setToast({ type: "error", message: msg });
      return;
    }

    if (!bloodGroup || !district || !upazila) {
      const msg = "Please select blood group, district, and upazila.";
      setErr(msg);
      setToast({ type: "error", message: msg });
      return;
    }

    const pwdIssues = validatePassword(password);
    if (pwdIssues.length) {
      const msg = pwdIssues.join(" ");
      setPwdErr(msg);
      setToast({ type: "error", message: msg });
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Password and confirm password do not match.";
      setPwdErr(msg);
      setToast({ type: "error", message: msg });
      return;
    }

    try {
      setLoading(true);

      // STEP 1: Upload avatar
      let avatarUrl = "";
      try {
        avatarUrl = await uploadAvatarToImgBB(avatarFile);
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        setErr(uploadError.message || "Avatar upload failed.");
        setToast({
          type: "error",
          message: uploadError.message || "Avatar upload failed.",
        });
        return;
      }

      // STEP 2: Firebase auth
      await createUser(email, password);
      await updateUser({ displayName: name, photoURL: avatarUrl });

      // STEP 3: Save to backend
      const userForDb = {
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
      };

      try {
        await saveUserToDatabase(userForDb);
      } catch (backendError) {
        console.error("Backend /users error:", backendError);
        setErr(backendError.message || "Backend error saving user.");
        setToast({
          type: "error",
          message: backendError.message || "Backend error saving user.",
        });
        return;
      }

      setToast({ type: "success", message: "Account created! Redirecting…" });
      form.reset();
      setSelectedDistrict("");
      setSelectedUpazila("");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Register error (auth):", error);
      const map = {
        "auth/email-already-in-use": "Email already in use.",
        "auth/invalid-email": "Invalid email address.",
        "auth/operation-not-allowed": "Email/password accounts are disabled.",
        "auth/weak-password": "Password is too weak.",
      };
      const msg = map[error.code] || error.message || "Something went wrong.";
      setErr(msg);
      setToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedUpazila("");
  };

  return (
    <section className="py-10 md:py-16 ">
      <Container>
        <div className=" grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.1fr)] gap-8 items-stretch">
          {/* Left: brand / value prop */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#DC2626] via-[#EA384D] to-[#F97316] text-white shadow-2xl">
            <div className="absolute -top-10 -right-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

            <div className="relative px-7 py-7 md:px-9 md:py-9 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold uppercase tracking-[0.25em]">
                  <FiDroplet className="w-3.5 h-3.5" />
                  Join as a donor
                </div>

                <h1 className="mt-4 text-2xl md:text-3xl font-extrabold leading-snug">
                  One account, countless chances to save lives.
                </h1>

                <p className="mt-3 text-sm md:text-base text-white/90 max-w-md">
                  Create your donor profile with verified location and blood group.
                  Patients and volunteers can then find you quickly when every
                  minute matters.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="rounded-2xl bg-black/10 p-3.5 border border-white/15">
                    <p className="font-semibold flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      Location-aware requests
                    </p>
                    <p className="mt-1 text-white/85">
                      Match with nearby patients by district and upazila for
                      faster coordination.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/10 p-3.5 border border-white/15">
                    <p className="font-semibold flex items-center gap-2">
                      <FiShield className="w-4 h-4" />
                      Secure &amp; verified
                    </p>
                    <p className="mt-1 text-white/85">
                      Your data is stored securely and used only to connect you
                      with genuine requests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 text-xs md:text-sm flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Active donors stay visible on search.
                </span>
                <span className="opacity-80">
                  You can update your details anytime from your dashboard.
                </span>
              </div>
            </div>
          </div>

          {/* Right: registration form */}
          <div className="card bg-base-100 w-full max-w-xl mx-auto shadow-xl border border-base-200/70 rounded-3xl">
            <div className="card-body px-6 py-6 md:px-8 md:py-7">
              <div className="mb-4 text-center">
                <h2 className="text-xl md:text-2xl font-bold">
                  Create your donor account
                </h2>
                <p className="mt-1 text-xs md:text-sm text-slate-500">
                  Fill in your basic details. You can manage everything later
                  from your dashboard.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full name
                    </span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input input-bordered rounded-xl"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input input-bordered rounded-xl"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Avatar */}
                <div className="form-control">
                  <label className="label" htmlFor="avatar">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Avatar
                    </span>
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full rounded-xl"
                    required
                  />
                  <span className="mt-1 text-[11px] text-slate-500">
                    Upload a clear image. This helps requesters recognise you on
                    donation confirmations.
                  </span>
                </div>

                {/* Blood + location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Blood Group */}
                  <div className="form-control">
                    <label className="label" htmlFor="bloodGroup">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Blood group
                      </span>
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      className="select select-bordered rounded-xl"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label" htmlFor="district">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        District
                      </span>
                    </label>
                    <select
                      id="district"
                      name="district"
                      className="select select-bordered rounded-xl"
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select district
                      </option>
                      {districtOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila */}
                  <div className="form-control">
                    <label className="label" htmlFor="upazila">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Upazila
                      </span>
                    </label>
                    <select
                      id="upazila"
                      name="upazila"
                      className="select select-bordered rounded-xl"
                      value={selectedUpazila}
                      onChange={(e) => setSelectedUpazila(e.target.value)}
                      required
                      disabled={!selectedDistrict}
                    >
                      <option value="" disabled>
                        {selectedDistrict
                          ? "Select upazila"
                          : "Select district first"}
                      </option>
                      {selectedDistrict &&
                        (upazilaOptionsByDistrict[selectedDistrict] || []).map(
                          (u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="form-control">
                    <label className="label" htmlFor="password">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={show ? "text" : "password"}
                        className={`input input-bordered w-full rounded-xl ${
                          pwdErr ? "input-error" : ""
                        }`}
                        placeholder="Password"
                        required
                        aria-invalid={!!pwdErr}
                        aria-describedby={pwdErr ? "password-help" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-label={show ? "Hide password" : "Show password"}
                      >
                        {show ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label" htmlFor="confirmPassword">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Confirm password
                      </span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`input input-bordered w-full rounded-xl ${
                        pwdErr ? "input-error" : ""
                      }`}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                {pwdErr && (
                  <p id="password-help" className="text-error text-sm mt-1">
                    {pwdErr}
                  </p>
                )}
                {err && <p className="text-error text-sm mt-1">{err}</p>}

                <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-500">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <p>
                    By registering, you confirm that you are eligible to donate
                    blood and consent to being contacted for matching requests in
                    your area.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn w-full mt-3 rounded-full border-0
                    bg-gradient-to-r from-[#DC2626] via-[#EA384D] to-[#F97316]
                    text-white font-semibold shadow-lg shadow-red-300/60
                    hover:shadow-red-400/80 transition"
                  disabled={loading}
                >
                  {loading ? "Creating…" : "Create donor account"}
                </button>

                <p className="text-center text-xs md:text-sm mt-3">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </Container>

      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;
