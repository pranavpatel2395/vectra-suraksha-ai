/**
 * Vectra Jansadak Suraksha AI - Realistic Canvas Vehicle & Road Renderer
 * Generates vivid, metallic, identifiable multi-colored vehicles with true perspective scaling.
 */

// Helper to adjust color brightness for metallic gradients
export function adjustBrightness(hex, percent) {
  if (!hex || typeof hex !== 'string') return '#94a3b8';
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  let num = parseInt(cleanHex, 16);
  if (isNaN(num)) return hex;
  
  let r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * (percent / 100))));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100))));
  let b = Math.min(255, Math.max(0, (num & 0x0000ff) + Math.round(255 * (percent / 100))));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Returns distinct, vividly colored vehicles tailored for a specific camera
 */
export function getStandardVehiclesForCamera(camId = 'CAM-01', seed = 0) {
  const isTargetCam = camId === 'CAM-01' || camId === 'CAM-07';

  // Palette of vivid, identifiable vehicle colors
  const colorPalette = [
    { color: '#dc2626', colorName: 'Red', type: 'Sedan', plate: 'DL01CA9988' },
    { color: '#2563eb', colorName: 'Blue', type: 'SUV', plate: 'HR26EF9876' },
    { color: '#f59e0b', colorName: 'Amber', type: 'Cab', plate: 'MH12DE3456' },
    { color: '#059669', colorName: 'Green', type: 'Hatchback', plate: 'KA03XY7711' },
    { color: '#ea580c', colorName: 'Orange', type: 'SUV', plate: 'UP14CD5544' },
    { color: '#7c3aed', colorName: 'Purple', type: 'Sedan', plate: 'DL04EB2211' },
    { color: '#0284c7', colorName: 'Sky Blue', type: 'Car', plate: 'HR51AA9090' },
    { color: '#b91c1c', colorName: 'Maroon', type: 'Sedan', plate: 'UP32MN4321' },
    { color: '#1e293b', colorName: 'Black', type: 'SUV', plate: 'DL08BK8800' }
  ];

  const pick1 = colorPalette[(seed * 2) % colorPalette.length];
  const pick2 = colorPalette[(seed * 2 + 1) % colorPalette.length];
  const pick3 = colorPalette[(seed * 2 + 3) % colorPalette.length];
  const pick4 = colorPalette[(seed * 2 + 5) % colorPalette.length];

  return [
    {
      lane: 0,
      y: 80 + (seed * 15) % 40,
      speed: 1.15 + (seed % 3) * 0.15,
      type: isTargetCam ? 'SUV' : pick1.type,
      color: isTargetCam ? '#dc2626' : pick1.color, // Target is vivid red for clear detection
      colorName: isTargetCam ? 'Red' : pick1.colorName,
      plate: isTargetCam ? 'UP16AB1234' : pick1.plate,
      isWanted: isTargetCam
    },
    {
      lane: 1,
      y: 140 + (seed * 20) % 50,
      speed: 1.45,
      type: pick2.type,
      color: pick2.color,
      colorName: pick2.colorName,
      plate: pick2.plate,
      isWanted: false
    },
    {
      lane: 2,
      y: 195 + (seed * 10) % 30,
      speed: 0.95,
      type: pick3.type,
      color: pick3.color,
      colorName: pick3.colorName,
      plate: pick3.plate,
      isWanted: false
    },
    {
      lane: 3,
      y: 110 + (seed * 25) % 45,
      speed: 1.35,
      type: pick4.type,
      color: pick4.color,
      colorName: pick4.colorName,
      plate: pick4.plate,
      isWanted: false
    }
  ];
}

/**
 * Draws perspective highway road background
 */
export function drawPerspectiveRoad(ctx, width, height, horizonY = 70, vpX = null, frameCount = 0) {
  if (vpX === null) vpX = width / 2;

  // 1. Dark Asphalt Base
  ctx.fillStyle = '#080c16';
  ctx.fillRect(0, 0, width, height);

  // 2. Concrete Shoulder & Barriers
  ctx.fillStyle = '#0f172a';
  // Left shoulder
  ctx.beginPath();
  ctx.moveTo(vpX - 48, horizonY);
  ctx.lineTo(0, height);
  ctx.lineTo(0, horizonY);
  ctx.closePath();
  ctx.fill();

  // Right shoulder
  ctx.beginPath();
  ctx.moveTo(vpX + 48, horizonY);
  ctx.lineTo(width, height);
  ctx.lineTo(width, horizonY);
  ctx.closePath();
  ctx.fill();

  // Horizon line sky/background
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, width, horizonY);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.stroke();

  // 3. Perspective Highway Road Surface
  ctx.fillStyle = '#0b1120';
  ctx.beginPath();
  ctx.moveTo(vpX - 48, horizonY);
  ctx.lineTo(vpX + 48, horizonY);
  ctx.lineTo(width - 25, height);
  ctx.lineTo(25, height);
  ctx.closePath();
  ctx.fill();

  // Outer Solid Edge Lines (Vibrant Cyan)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(vpX - 47, horizonY);
  ctx.lineTo(26, height);
  ctx.moveTo(vpX + 47, horizonY);
  ctx.lineTo(width - 26, height);
  ctx.stroke();

  // Inner Dashed Lane Markings with dynamic motion
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([12, 16]);
  ctx.lineDashOffset = -frameCount * 2.5;

  [-0.5, 0.5].forEach(laneBorder => {
    ctx.beginPath();
    const startX = vpX + laneBorder * 24;
    const endX = vpX + laneBorder * 190;
    ctx.moveTo(startX, horizonY);
    ctx.lineTo(endX, height);
    ctx.stroke();
  });

  // Center Double Yellow Median
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(vpX - 1.5, horizonY);
  ctx.lineTo(vpX - 2.5, height);
  ctx.moveTo(vpX + 1.5, horizonY);
  ctx.lineTo(vpX + 2.5, height);
  ctx.stroke();
}

/**
 * Calculates perspective X position for a lane at vertical position Y
 */
export function getLaneX(laneIndex, y, width = 480, height = 270, horizonY = 70) {
  const vpX = width / 2;
  const t = Math.max(0, (y - horizonY) / (height - horizonY));
  const laneSpread = 24 + t * 95;
  const offsetFactor = laneIndex - 1.5;
  return vpX + offsetFactor * laneSpread;
}

/**
 * Renders an identifiable, realistic 3D vehicle with vivid metallic color
 */
export function drawRealisticVehicle(ctx, x, y, width, height, vehicle, isTarget = false) {
  ctx.save();

  // 1. Soft Ground Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, width * 0.65, height * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. 4 Rubber Tires with Wheel Rims
  const tireW = Math.max(2.5, width * 0.16);
  const tireH = Math.max(5, height * 0.22);
  const tireOffsetX = width * 0.44;
  const tireOffsetY = height * 0.32;
  
  ctx.fillStyle = '#0f172a';
  [
    [-tireOffsetX, -tireOffsetY],
    [tireOffsetX - tireW, -tireOffsetY],
    [-tireOffsetX, tireOffsetY - tireH],
    [tireOffsetX - tireW, tireOffsetY - tireH]
  ].forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.roundRect(x + tx, y + ty, tireW, tireH, 2);
    ctx.fill();
    // Silver Rim Center Dot
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + tx + 0.5, y + ty + tireH * 0.35, tireW - 1, tireH * 0.3);
    ctx.fillStyle = '#0f172a';
  });

  // 3. Main Chassis (Vivid Metallic Paint Gradient)
  const bodyW = width;
  const bodyH = height;
  const bodyX = x - bodyW / 2;
  const bodyY = y - bodyH / 2;
  const radius = Math.max(3, bodyW * 0.15);

  const baseColor = vehicle.color || '#dc2626';
  const bodyGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY);
  bodyGrad.addColorStop(0, adjustBrightness(baseColor, -25));
  bodyGrad.addColorStop(0.25, baseColor);
  bodyGrad.addColorStop(0.65, adjustBrightness(baseColor, 35)); // Specular metallic reflection
  bodyGrad.addColorStop(1, adjustBrightness(baseColor, -30));

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(bodyX, bodyY, bodyW, bodyH, radius);
  ctx.fill();

  // Subtle chassis contour stroke
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 4. Front Bumper & Dual Glowing Headlights
  const headW = Math.max(3, bodyW * 0.22);
  const headH = Math.max(2, bodyH * 0.07);
  
  // Headlight illumination cone on road ahead
  ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
  ctx.beginPath();
  ctx.moveTo(x, bodyY);
  ctx.lineTo(x - bodyW * 0.8, bodyY - bodyH * 0.6);
  ctx.lineTo(x + bodyW * 0.8, bodyY - bodyH * 0.6);
  ctx.closePath();
  ctx.fill();

  // Headlight Bulbs
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(bodyX + bodyW * 0.1, bodyY + 1, headW, headH);
  ctx.fillRect(bodyX + bodyW * 0.9 - headW, bodyY + 1, headW, headH);

  // 5. Dark Tinted Windshield & Cabin Glass
  const cabinW = bodyW * 0.8;
  const cabinH = bodyH * 0.58;
  const cabinX = x - cabinW / 2;
  const cabinY = y - cabinH / 2 - bodyH * 0.02;

  ctx.fillStyle = '#060a12';
  ctx.beginPath();
  ctx.roundRect(cabinX, cabinY, cabinW, cabinH, Math.max(2, cabinW * 0.12));
  ctx.fill();

  // Windshield Glare Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cabinX + cabinW * 0.2, cabinY + 2);
  ctx.lineTo(cabinX + cabinW * 0.8, cabinY + cabinH - 2);
  ctx.stroke();

  // 6. Car Roof (Vivid Body Color with Sunroof/Panel)
  const roofW = cabinW * 0.74;
  const roofH = cabinH * 0.52;
  const roofX = x - roofW / 2;
  const roofY = y - roofH / 2 - bodyH * 0.02;

  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.roundRect(roofX, roofY, roofW, roofH, Math.max(2, roofW * 0.1));
  ctx.fill();

  // 7. Rear Taillights (Vibrant Red) & HSRP License Plate
  const tailW = Math.max(3, bodyW * 0.22);
  const tailH = Math.max(2.5, bodyH * 0.07);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(bodyX + bodyW * 0.08, bodyY + bodyH - tailH - 1, tailW, tailH);
  ctx.fillRect(bodyX + bodyW * 0.92 - tailW, bodyY + bodyH - tailH - 1, tailW, tailH);

  // Tail brake glow
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, bodyY + bodyH + 3, bodyW * 0.6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rear Plate (Yellow HSRP)
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x - bodyW * 0.22, bodyY + bodyH - 2.5, bodyW * 0.44, 2);

  // 8. Edge AI Bounding Box & Class Tag
  const pad = Math.max(3.5, width * 0.12);
  const bboxColor = isTarget ? '#ef4444' : '#38bdf8';
  ctx.strokeStyle = bboxColor;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(bodyX - pad, bodyY - pad, bodyW + pad * 2, bodyH + pad * 2);

  // Detection Label
  const tagBg = isTarget ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.92)';
  const labelText = isTarget
    ? `TARGET: ${vehicle.plate || 'UP16AB1234'}`
    : `${vehicle.colorName || ''} ${vehicle.type || 'CAR'} [98%]`.trim();
  
  const fontSize = Math.max(8, Math.round(width * 0.26));
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
  const textW = ctx.measureText(labelText).width;
  const tagH = Math.max(12, fontSize + 4);

  ctx.fillStyle = tagBg;
  ctx.fillRect(bodyX - pad, bodyY - pad - tagH, textW + 6, tagH);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(labelText, bodyX - pad + 3, bodyY - pad - 3);

  ctx.restore();
}
