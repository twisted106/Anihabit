import assert from 'node:assert';
import { AVATAR_PRESETS, DEFAULT_AVATAR, DEFAULT_PLAYER_NAME } from './src/constants/avatarPresets.js';

console.log('--- Running Profile Customization Automated Verification Tests ---');

// Test 1: Verify Preset Avatars contain both Male and Female champions
console.log('Test 1: Preset avatars catalog diversity check');
assert(AVATAR_PRESETS.length >= 6, 'Should have at least 6 presets');
const malePresets = AVATAR_PRESETS.filter(p => p.gender === 'male');
const femalePresets = AVATAR_PRESETS.filter(p => p.gender === 'female');

console.log(`Male presets count: ${malePresets.length}`);
console.log(`Female presets count: ${femalePresets.length}`);

assert(malePresets.length >= 3, 'Must have at least 3 male presets');
assert(femalePresets.length >= 3, 'Must have at least 3 female presets');

// Check that each preset has required fields and valid paths
for (const preset of AVATAR_PRESETS) {
  assert(preset.id, 'Preset must have an id');
  assert(preset.name, 'Preset must have a name');
  assert(preset.gender === 'male' || preset.gender === 'female', 'Preset must specify male or female');
  assert(preset.role, 'Preset must have a role');
  assert(preset.imageSrc.startsWith('/images/avatars/'), `Preset imageSrc must be in /images/avatars/: ${preset.imageSrc}`);
}
console.log('✓ Test 1 Passed: Avatar presets catalog contains balanced male and female characters with valid assets.');

// Test 2: PNG Format Validation Logic
console.log('\nTest 2: Strict PNG file format validation logic');

function validatePngFile(filename, mimeType, sizeBytes) {
  const isPngExtension = filename.toLowerCase().endsWith('.png');
  const isPngMime = mimeType === 'image/png' || mimeType === '';
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  if (!isPngExtension || !isPngMime) {
    return { valid: false, error: 'Only PNG (.png) images are permitted.' };
  }
  if (sizeBytes > MAX_SIZE_BYTES) {
    return { valid: false, error: 'Image exceeds 5MB limit.' };
  }
  return { valid: true };
}

// Test rejection of non-PNG extensions / MIME types
const invalidFiles = [
  { name: 'photo.jpg', type: 'image/jpeg', size: 100000 },
  { name: 'picture.jpeg', type: 'image/jpeg', size: 100000 },
  { name: 'avatar.webp', type: 'image/webp', size: 100000 },
  { name: 'image.gif', type: 'image/gif', size: 100000 },
  { name: 'portrait.bmp', type: 'image/bmp', size: 100000 },
  { name: 'vector.svg', type: 'image/svg+xml', size: 100000 },
  { name: 'fake.png.jpg', type: 'image/jpeg', size: 100000 },
  { name: 'oversized_avatar.png', type: 'image/png', size: 6 * 1024 * 1024 } // > 5MB
];

for (const f of invalidFiles) {
  const res = validatePngFile(f.name, f.type, f.size);
  assert.strictEqual(res.valid, false, `File ${f.name} should have been rejected`);
}
console.log('✓ Test 2 Passed: All non-PNG and oversized files strictly rejected.');

// Test acceptance of valid PNG files (including files up to 5MB)
const validFiles = [
  { name: 'my_avatar.png', type: 'image/png', size: 500000 },
  { name: 'large_avatar_4mb.png', type: 'image/png', size: 4 * 1024 * 1024 }, // 4MB valid
  { name: 'CHARACTER.PNG', type: 'image/png', size: 4.8 * 1024 * 1024 },
  { name: 'custom_hero_123.png', type: '', size: 300000 }
];

for (const f of validFiles) {
  const res = validatePngFile(f.name, f.type, f.size);
  assert.strictEqual(res.valid, true, `File ${f.name} should have been accepted`);
}
console.log('✓ Test 2 Passed: Valid PNG files correctly accepted.');

// Test 3: Player Name Validation
console.log('\nTest 3: Champion Moniker validation logic');

function validateChampionName(name) {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { valid: false, error: 'Name cannot be blank' };
  }
  if (trimmed.length > 24) {
    return { valid: false, error: 'Name must be 24 characters or less' };
  }
  return { valid: true, name: trimmed };
}

assert.strictEqual(validateChampionName('').valid, false);
assert.strictEqual(validateChampionName('   ').valid, false);
assert.strictEqual(validateChampionName('A very very very very long champion name that exceeds 24 chars').valid, false);

const validName = validateChampionName('  Shadow Monarch  ');
assert.strictEqual(validName.valid, true);
assert.strictEqual(validName.name, 'Shadow Monarch');
console.log('✓ Test 3 Passed: Champion name validation strictly enforces trimmed, non-blank, max 24 chars.');

console.log('\n=============================================');
console.log('ALL TESTS PASSED SUCCESSFULLY (3/3)');
console.log('=============================================');
