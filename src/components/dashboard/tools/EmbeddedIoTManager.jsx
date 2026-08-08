import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Battery, ShieldCheck, RefreshCw, CheckCircle, AlertCircle, Sun, Wind, Thermometer, Droplets, Zap } from 'lucide-react';
import { IoTService } from '../../../services/iotService';

export const EmbeddedIoTManager = () => {
  const [deviceIdInput, setDeviceIdInput] = useState('IOT-AGRI-8842');
  const [devicePasswordInput, setDevicePasswordInput] = useState('');
  const [pairedDevice, setPairedDevice] = useState(null);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingError, setPairingError] = useState('');
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    const activeId = IoTService.getPairedDeviceId();
    if (activeId) {
      setDeviceIdInput(activeId);
      handlePair(activeId, '');
    }
  }, []);

  useEffect(() => {
    if (!pairedDevice?.deviceId) return;
    const unsub = IoTService.subscribeToTelemetry(pairedDevice.deviceId, (updated) => {
      setTelemetry(updated);
    });
    return () => unsub();
  }, [pairedDevice?.deviceId]);

  const handlePair = async (idToPair, passToPair) => {
    setIsPairing(true);
    setPairingError('');
    try {
      const device = await IoTService.pairDevice(idToPair || deviceIdInput, passToPair || devicePasswordInput);
      setPairedDevice(device);
      setTelemetry(device);
    } catch (e) {
      setPairingError(e.message);
    } finally {
      setIsPairing(false);
    }
  };

  const handleUnpair = () => {
    IoTService.unpairDevice();
    setPairedDevice(null);
    setTelemetry(null);
  };

  const data = telemetry?.data || {};

  return (
    <div className="space-y-6 text-white font-sans p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-cyan-950/60 p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl glow-emerald">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Firebase Telemetry Gateway</span>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-1">
            <Cpu className="w-6 h-6 text-emerald-400" /> IoT Hardware Telemetry & Device Manager
          </h2>
          <p className="text-slate-400 text-xs mt-1">Firebase Path: <code className="text-emerald-300 font-mono">iot --&gt; &#123;iot_id&#125; --&gt; &#123;configuration, status, batteryHealth, data&#125;</code></p>
        </div>
        
        {pairedDevice && (
          <button
            onClick={handleUnpair}
            className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold rounded-xl transition-all font-mono"
          >
            Unpair Device
          </button>
        )}
      </div>

      {/* Pairing Card */}
      {!pairedDevice ? (
        <div className="bg-[#0f172a]/80 p-8 rounded-3xl border border-white/10 max-w-xl mx-auto space-y-6 shadow-2xl backdrop-blur-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Pair IoT Sensor Hardware</h3>
            <p className="text-slate-400 text-xs">Enter your microcontroller Device ID and access key password</p>
          </div>

          {pairingError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{pairingError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Hardware Device ID (iot_id)</label>
              <input
                type="text"
                value={deviceIdInput}
                onChange={(e) => setDeviceIdInput(e.target.value)}
                placeholder="e.g. IOT-AGRI-8842"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Device Password / Access Key</label>
              <input
                type="password"
                value={devicePasswordInput}
                onChange={(e) => setDevicePasswordInput(e.target.value)}
                placeholder="Enter hardware password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
              />
            </div>

            <button
              onClick={() => handlePair(deviceIdInput, devicePasswordInput)}
              disabled={isPairing}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
            >
              {isPairing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isPairing ? 'Authenticating with Firebase...' : 'Pair Hardware Device'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hardware Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0f172a]/80 p-5 rounded-3xl border border-emerald-500/30 flex items-center gap-4 glow-emerald backdrop-blur-2xl">
              <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400 border border-emerald-500/30">
                <Wifi className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Device Status</span>
                <p className="text-lg font-black text-emerald-400 flex items-center gap-1.5 mt-0.5 font-mono">
                  <CheckCircle className="w-4 h-4" /> {telemetry?.status || 'Online'}
                </p>
              </div>
            </div>

            <div className="bg-[#0f172a]/80 p-5 rounded-3xl border border-blue-500/30 flex items-center gap-4 glow-cyan backdrop-blur-2xl">
              <div className="p-3 bg-blue-500/15 rounded-2xl text-blue-400 border border-blue-500/30">
                <Battery className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Battery Health</span>
                <p className="text-lg font-black text-blue-400 mt-0.5 font-mono">
                  {telemetry?.batteryHealth || '96%'}
                </p>
              </div>
            </div>

            <div className="bg-[#0f172a]/80 p-5 rounded-3xl border border-purple-500/30 flex items-center gap-4 backdrop-blur-2xl">
              <div className="p-3 bg-purple-500/15 rounded-2xl text-purple-400 border border-purple-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Signal Strength (RSSI)</span>
                <p className="text-lg font-black text-purple-400 mt-0.5 font-mono">
                  {telemetry?.signalStrength || '-62 dBm'}
                </p>
              </div>
            </div>

            <div className="bg-[#0f172a]/80 p-5 rounded-3xl border border-amber-500/30 flex items-center gap-4 glow-amber backdrop-blur-2xl">
              <div className="p-3 bg-amber-500/15 rounded-2xl text-amber-400 border border-amber-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Firmware Version</span>
                <p className="text-lg font-black text-amber-400 mt-0.5 font-mono">
                  {telemetry?.firmwareVersion || 'v2.4.1'}
                </p>
              </div>
            </div>
          </div>

          {/* Full Sensor Telemetry Grid */}
          <div className="bg-[#0f172a]/90 p-7 rounded-3xl border border-white/10 space-y-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Live Sensor Telemetry Parameters</h3>
                <p className="text-xs text-slate-400 font-mono">Firebase path: <code className="text-emerald-300">iot/{pairedDevice.deviceId}/data</code></p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
                ⚡ 3-Second Synchronized Stream
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Nitrogen (N)</span>
                <p className="text-3xl font-black text-emerald-400 font-mono">{data.nitrogen ?? 145} <span className="text-xs font-normal text-slate-400 font-sans">PPM</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Phosphorus (P)</span>
                <p className="text-3xl font-black text-blue-400 font-mono">{data.phosphorus ?? 48} <span className="text-xs font-normal text-slate-400 font-sans">PPM</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Potassium (K)</span>
                <p className="text-3xl font-black text-purple-400 font-mono">{data.potassium ?? 192} <span className="text-xs font-normal text-slate-400 font-sans">PPM</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Sulphur (S)</span>
                <p className="text-3xl font-black text-amber-400 font-mono">{data.sulphur ?? 24} <span className="text-xs font-normal text-slate-400 font-sans">PPM</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Soil Moisture
                </span>
                <p className="text-3xl font-black text-blue-400 font-mono">{data.moisture ?? 66}%</p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Light Intensity
                </span>
                <p className="text-3xl font-black text-amber-300 font-mono">{data.lightIntensity ?? 38500} <span className="text-xs font-normal text-slate-400 font-sans">Lux</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Speed
                </span>
                <p className="text-3xl font-black text-cyan-300 font-mono">{data.windSpeed ?? 8.5} <span className="text-xs font-normal text-slate-400 font-sans">km/h</span></p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Soil Temp
                </span>
                <p className="text-3xl font-black text-orange-400 font-mono">{data.soilTemperature ?? 22.4}°C</p>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 font-mono">
                  <Thermometer className="w-3.5 h-3.5 text-red-400" /> Air Temp
                </span>
                <p className="text-3xl font-black text-red-400 font-mono">{data.airTemperature ?? 31.2}°C</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
