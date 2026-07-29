"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface BatteryDetail {
  sn: string;
  name: string;
  category: string;
  nominalVoltage: string;
  fullyChargedVoltage: string;
  dischargeCutOff: string;
  nominalCapacity: string;
  totalEnergy: string;
  cellConfiguration: string;
  motorCompatibility: string;
  application: string;
  avgRidingCurrent: string;
  estRuntime: string;
  estRange: string;
  energyEfficiency: string;
  cycleLife: string;
  chargingTime: string;
}

interface Props {
  battery: BatteryDetail;
  logoUrl?: string;
  qrUrl?: string;
}

export const BatteryPdfTemplate = React.forwardRef<HTMLDivElement, Props>(({ battery, logoUrl, qrUrl }, ref) => {
  const GREEN = "#22c55e";
  const DARK = "#0a112a";

  const specRows = [
    { label: "NOMINAL VOLTAGE", value: battery.nominalVoltage, icon: "⚡", label2: "APPLICATION", value2: battery.application, icon2: "🛴" },
    { label: "FULLY CHARGED VOLTAGE", value: battery.fullyChargedVoltage, icon: "🔋", label2: "AVG RIDING CURRENT", value2: battery.avgRidingCurrent, icon2: "📉" },
    { label: "DISCHARGE CUT-OFF", value: battery.dischargeCutOff, icon: "🛑", label2: "EST RUNTIME", value2: battery.estRuntime, icon2: "⏳" },
    { label: "NOMINAL CAPACITY", value: battery.nominalCapacity, icon: "📦", label2: "EST RANGE", value2: battery.estRange, icon2: "📍" },
    { label: "TOTAL ENERGY", value: battery.totalEnergy, icon: "💎", label2: "ENERGY EFFICIENCY", value2: battery.energyEfficiency, icon2: "📊" },
    { label: "CELL CONFIGURATION", value: battery.cellConfiguration, icon: "🔋", label2: "CYCLE LIFE", value2: battery.cycleLife, icon2: "🔄" },
    { label: "MOTOR COMPATIBILITY", value: battery.motorCompatibility, icon: "⚙️", label2: "CHARGING TIME", value2: battery.chargingTime, icon2: "🔌" },
    { label: "WARRANTY PERIOD", value: (battery as any).warrantyMonths ? `${(battery as any).warrantyMonths} MONTHS` : "N/A", icon: "🛡️", label2: "", value2: "", icon2: "" },
  ];

  const SpecItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${GREEN}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        fontSize: "14px", lineHeight: "1"
      }}>
        <span>{icon}</span>
      </div>
      <div style={{ display: "flex", gap: "4px", alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: GREEN, whiteSpace: "nowrap" }}>{label}:</span>
        <span style={{ fontSize: "13px", fontWeight: 800, color: DARK }}>{value || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        width: "820px",
        padding: "16px",
        backgroundColor: GREEN,
        borderRadius: "16px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{
        backgroundColor: "white",
        width: "100%",
        padding: "36px 40px 28px",
        borderRadius: "12px",
        boxSizing: "border-box",
      }}>
        {/* Header: Logo + S/N */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" style={{ maxHeight: "60px", maxWidth: "220px", objectFit: "contain" }} crossOrigin="anonymous" />
            ) : (
              <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "2px" }}>
                <span style={{ color: DARK }}>X</span>
                <span style={{ color: GREEN }}>O</span>
                <span style={{ color: DARK }}>RBIT</span>
                <span style={{ color: DARK, marginLeft: "6px", fontStyle: "italic" }}>EV</span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "26px", fontWeight: 900, color: DARK,
            textTransform: "uppercase", letterSpacing: "1.5px", margin: 0,
          }}>
            {battery.name}
          </h1>
        </div>

        {/* Specs Grid: Two Columns */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "24px" }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            {specRows.map((row, i) => (
              <SpecItem key={`l-${i}`} icon={row.icon} label={row.label} value={row.value} />
            ))}
          </div>
          {/* Right Column */}
          <div style={{ flex: 1 }}>
            {specRows.map((row, i) => (
              <SpecItem key={`r-${i}`} icon={row.icon2} label={row.label2} value={row.value2} />
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{
          borderTop: `2px solid ${GREEN}22`,
          paddingTop: "16px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
        }}>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: DARK }}>*(Speed &amp; Load Dependent)</p>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: DARK }}>**(Depending on Charger Output)</p>
        </div>
      </div>
    </div>
  );
});

BatteryPdfTemplate.displayName = "BatteryPdfTemplate";
