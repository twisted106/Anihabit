import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, AlertTriangle, Sparkles, User, Shield, Image as ImageIcon } from 'lucide-react';
import { AVATAR_PRESETS, DEFAULT_AVATAR, DEFAULT_PLAYER_NAME } from '../constants/avatarPresets';

/**
 * SCREEN — Customize Champion Profile Modal
 * 
 * Features:
 * - Real-time live card preview of the champion's name and portrait
 * - Customizable Champion Name / Moniker (validated, max 24 chars)
 * - Curated preset avatars featuring both male and female fantasy champions
 * - Filter presets by All, Male, Female, or Custom PNG
 * - Custom picture upload STRICTLY validated for PNG format only (.png / image/png)
 * - Instant error toasts & inline alerts for invalid formats or excessive sizes
 * - Tabletop Tavern Hearth gold-and-wood aesthetic
 */
export default function CustomizeProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  notify
}) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'male' | 'female' | 'custom'
  const [uploadError, setUploadError] = useState(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Synchronize state whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.display_name || DEFAULT_PLAYER_NAME);
      const currentAvatar = profile.avatar_url || DEFAULT_AVATAR;
      setSelectedAvatar(currentAvatar);
      setUploadError(null);
      
      // If current avatar is a custom data URI or external URL not in presets, keep preview
      const isPreset = AVATAR_PRESETS.some(p => p.imageSrc === currentAvatar);
      if (!isPreset && currentAvatar) {
        setCustomAvatarPreview(currentAvatar);
      }
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Filtered preset champions
  const filteredPresets = AVATAR_PRESETS.filter(preset => {
    if (genderFilter === 'male') return preset.gender === 'male';
    if (genderFilter === 'female') return preset.gender === 'female';
    return true;
  });

  // Strict PNG file validation and handler
  const handleFileUpload = (file) => {
    setUploadError(null);
    if (!file) return;

    // 1. Strict PNG Format Validation (MIME type and file extension)
    const isPngExtension = file.name.toLowerCase().endsWith('.png');
    const isPngMime = file.type === 'image/png' || file.type === '';

    if (!isPngExtension || !isPngMime) {
      const errorMsg = 'Invalid file format! Only PNG (.png) images are permitted.';
      setUploadError(errorMsg);
      if (notify) {
        notify('Strict Requirement: Only PNG (.png) format images are accepted!', 'warning', '⚠️');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 2. File size limit (5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const errorMsg = 'Image exceeds 5MB size limit. Please select a smaller PNG image.';
      setUploadError(errorMsg);
      if (notify) {
        notify('PNG file exceeds 5MB limit. Please compress or choose a smaller file.', 'warning', '⚠️');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 3. Read valid PNG as Data URL for instant rendering & persistence
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setCustomAvatarPreview(result);
        setSelectedAvatar(result);
        setGenderFilter('custom');
        if (notify) {
          notify('PNG avatar loaded successfully!', 'success', '🖼️');
        }
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setUploadError('Please enter a champion name.');
      if (notify) notify('Champion name cannot be blank.', 'warning', '⚠️');
      return;
    }

    if (trimmedName.length > 24) {
      setUploadError('Champion name must be 24 characters or less.');
      if (notify) notify('Champion name must be 24 characters or less.', 'warning', '⚠️');
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateProfile({
        display_name: trimmedName,
        avatar_url: selectedAvatar
      });
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
      if (notify) notify('Error updating profile.', 'danger', '❌');
    } finally {
      setIsSaving(false);
    }
  };

  // Find active preset details (if any)
  const activePreset = AVATAR_PRESETS.find(p => p.imageSrc === selectedAvatar);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-champion-title"
    >
      <div 
        className="relative w-full max-w-2xl guardian-card-frame p-4 sm:p-6 bg-wood-planks/95 border-4 border-[#2c190c] shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-xl my-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-900/80 text-amber-300 hover:text-white hover:bg-stone-800 border border-amber-900/60 transition-colors cursor-pointer"
          aria-label="Close customization modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b-2 border-amber-950/80 mb-4">
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 id="customize-champion-title" className="font-cinzel font-black text-lg sm:text-xl text-amber-200 tracking-wider uppercase drop-shadow">
              Champion Inscription
            </h3>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs font-newsreader text-amber-400/80 italic mt-0.5">
            Personalize your tabletop hero moniker and character portrait
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Top Row: Live Card Preview + Name Inscription Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#150a04]/70 p-3.5 rounded-xl border border-amber-900/60 shadow-inner">
            
            {/* Left: Mini Live Card Preview (Span 5) */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="w-36 h-48 guardian-card-frame p-1.5 relative flex flex-col justify-between shadow-2xl">
                {/* Plaque Header */}
                <div className="guardian-dark-inset py-1 px-1.5 text-center rounded">
                  <span className="font-garamond font-bold text-xs text-[#faecd1] truncate block">
                    {name.trim() || 'Nameless Champion'}
                  </span>
                </div>

                {/* Portrait Art */}
                <div className="relative w-full h-32 rounded-sm overflow-hidden border border-[#523712] bg-stone-950 my-1 shadow-inner">
                  <img 
                    src={selectedAvatar} 
                    alt={name || 'Champion Portrait'} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100b06]/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-amber-950/90 border border-amber-500/50 text-[8px] font-cinzel text-amber-300 font-bold">
                    LVL {profile?.current_level || 1}
                  </span>
                </div>

                {/* Role Badge */}
                <div className="text-center">
                  <span className="text-[8px] font-cinzel text-amber-400/90 uppercase tracking-widest truncate block">
                    {activePreset ? activePreset.role : 'Custom Champion'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-cinzel text-stone-400 mt-1">Live Tabletop Preview</span>
            </div>

            {/* Right: Name Input & Guidelines (Span 7) */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <label htmlFor="champion-name-input" className="block text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Champion Moniker (Player Name)
                </label>
                <div className="relative">
                  <input
                    id="champion-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 24))}
                    placeholder="e.g. Knight Protector, Arthur, Shadowblade"
                    maxLength={24}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-amber-700/70 text-amber-100 font-garamond text-base placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[10px] font-cinzel text-stone-500">
                    {name.length}/24
                  </span>
                </div>
                <p className="text-[11px] font-newsreader text-stone-400 mt-1 italic">
                  Visible on your tabletop card, character sheet, leaderboard, and deed tomes.
                </p>
              </div>

              {/* Status Notice */}
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] font-newsreader text-amber-200/90">
                  Choose an archetype from our male & female character roster below, or upload your own portrait strictly in <strong className="text-amber-300">PNG format</strong>.
                </p>
              </div>
            </div>

          </div>

          {/* Avatar Selection Section */}
          <div className="space-y-3">
            
            {/* Filter Chips & Tab Selection */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/60 pb-2">
              <div className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <span>Choose Champion Portrait</span>
              </div>

              {/* Gender & Custom Filter Buttons */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-amber-900/60 text-[10px] font-cinzel font-bold">
                <button
                  type="button"
                  onClick={() => setGenderFilter('all')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    genderFilter === 'all' ? 'bg-amber-600 text-stone-950 font-black' : 'text-amber-300/70 hover:text-amber-200'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('male')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    genderFilter === 'male' ? 'bg-amber-600 text-stone-950 font-black' : 'text-amber-300/70 hover:text-amber-200'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('female')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    genderFilter === 'female' ? 'bg-amber-600 text-stone-950 font-black' : 'text-amber-300/70 hover:text-amber-200'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('custom')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    genderFilter === 'custom' ? 'bg-amber-600 text-stone-950 font-black' : 'text-amber-300/70 hover:text-amber-200'
                  }`}
                >
                  <span>PNG Upload</span>
                </button>
              </div>
            </div>

            {/* View A: Preset Avatars Grid (When not strictly custom filter) */}
            {genderFilter !== 'custom' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedAvatar === preset.imageSrc;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset.imageSrc);
                        setUploadError(null);
                      }}
                      className={`group relative p-1.5 rounded-lg text-left transition-all border cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,180,40,0.5)] scale-[1.02]' 
                          : 'bg-stone-950/70 border-stone-800 hover:border-amber-700/80 hover:bg-stone-900/80'
                      }`}
                    >
                      {/* Avatar Image */}
                      <div className="relative w-full aspect-square rounded overflow-hidden bg-stone-900 border border-stone-800 mb-1.5">
                        <img 
                          src={preset.imageSrc} 
                          alt={preset.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-cinzel text-amber-300">
                          {preset.gender === 'male' ? '♂ Male' : '♀ Female'}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="truncate">
                        <div className="text-[11px] font-garamond font-bold text-parchment-200 truncate group-hover:text-amber-200">
                          {preset.name}
                        </div>
                        <div className="text-[9px] font-cinzel text-amber-400/70 truncate">
                          {preset.role}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* View B: Custom PNG Upload Zone */}
            <div className={`p-3 rounded-xl border-2 border-dashed transition-all ${
              genderFilter === 'custom' 
                ? 'border-amber-500/80 bg-amber-950/30' 
                : 'border-stone-800 bg-stone-950/40 hover:border-amber-800/60'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Upload Instructions */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-400 shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-cinzel font-bold text-amber-200">
                        Upload Custom Character Picture
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-cinzel font-black text-[9px] tracking-wider uppercase">
                        PNG Format Only
                      </span>
                    </div>
                    <p className="text-[10px] font-newsreader text-stone-400 mt-0.5">
                      Drag and drop your champion portrait here, or browse files. Strict requirement: <strong className="text-amber-300">.png</strong> files up to 5MB.
                    </p>
                  </div>
                </div>

                {/* File Upload Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,image/png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="champion-png-upload"
                  />
                  <label
                    htmlFor="champion-png-upload"
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-950 text-amber-300 hover:text-amber-200 border border-amber-700/60 text-xs font-cinzel font-bold transition-all cursor-pointer shadow"
                  >
                    Select PNG
                  </label>

                  {customAvatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(customAvatarPreview);
                        setGenderFilter('custom');
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                        selectedAvatar === customAvatarPreview 
                          ? 'bg-amber-600 text-stone-950 border-amber-400 font-black' 
                          : 'bg-stone-950 text-amber-300/80 border-stone-800 hover:border-amber-700'
                      }`}
                    >
                      Use Uploaded
                    </button>
                  )}
                </div>

              </div>

              {/* Upload Error Warning Alert */}
              {uploadError && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs flex items-center gap-2 font-cinzel">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-amber-950/80 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-cinzel text-xs font-bold transition-colors cursor-pointer border border-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-cinzel font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,180,40,0.5)] border border-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <span>Sealing Inscription...</span>
              ) : (
                <>
                  <span>✦</span>
                  <span>Save Champion Profile</span>
                  <span>✦</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
