function copyReferral() {
  const referralLink = "https://halora.com/ref/BHALA123";
  navigator.clipboard.writeText(referralLink);
  document.getElementById("copyText").innerText = "Referral link copied: " + referralLink;
}

function joinNow() {
  alert("Welcome to HALORA! Registration page will be added soon.");
}
