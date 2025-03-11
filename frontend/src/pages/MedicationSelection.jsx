import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

// Sample medication data (replace with actual data)
const medications = [
  'Acetaminophen', 'Adderall', 'Alprazolam', 'Amoxicillin',
  'Bupropion', 'Buspirone',
  'Cetirizine', 'Ciprofloxacin', 'Citalopram',
  'Diazepam', 'Duloxetine',
  'Escitalopram',
  'Fluoxetine',
  'Gabapentin',
  'Hydroxyzine',
  'Ibuprofen',
  'Lexapro', 'Lisinopril', 'Lorazepam',
  'Metformin', 'Metoprolol',
  'Naproxen',
  'Omeprazole',
  'Pantoprazole', 'Paroxetine', 'Prednisone',
  'Quetiapine',
  'Ranitidine', 'Risperidone',
  'Sertraline',
  'Trazodone',
  'Venlafaxine',
  'Warfarin',
  'Xanax',
  'Zoloft', 'Zyrtec'
].sort();

function MedicationSelection() {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const listRef = useRef(null);

  // Generate alphabet array
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#medication-selection', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  const handleBack = () => {
    gsap.to('#medication-selection', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/medication-assessment');
      }
    });
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMedicationSelect = (medication) => {
    if (selectedMeds.includes(medication)) {
      // Remove medication
      setSelectedMeds(prev => prev.filter(med => med !== medication));
      
      // Animate removal
      gsap.to(`#med-${medication.replace(/\s+/g, '-')}`, {
        backgroundColor: '#FFFFFF',
        scale: 1,
        duration: 0.3
      });
    } else {
      // Add medication
      setSelectedMeds(prev => [...prev, medication]);
      
      // Animate selection
      gsap.to(`#med-${medication.replace(/\s+/g, '-')}`, {
        backgroundColor: '#C5DAB7',
        scale: 1.02,
        duration: 0.3
      });
    }
  };

  const handleRemoveMedication = (medication) => {
    setSelectedMeds(prev => prev.filter(med => med !== medication));
    
    // Animate removal from selected list
    gsap.to(`#selected-${medication.replace(/\s+/g, '-')}`, {
      height: 0,
      opacity: 0,
      marginBottom: 0,
      duration: 0.3,
      onComplete: () => {
        // Reset the medication item in the main list
        gsap.to(`#med-${medication.replace(/\s+/g, '-')}`, {
          backgroundColor: '#FFFFFF',
          scale: 1,
          duration: 0.3
        });
      }
    });
  };

  const handleContinue = () => {
    if (selectedMeds.length > 0) {
      gsap.to('#medication-selection', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          navigate('/mental-health-symptoms');
        }
      });
    }
  };

  // Filter medications based on search query
  const filteredMedications = medications.filter(med => 
    med.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group medications by first letter
  const groupedMedications = filteredMedications.reduce((acc, med) => {
    const firstLetter = med[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(med);
    return acc;
  }, {});

  return (
    <div 
      id="medication-selection"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]/70">
            10 of 14
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-medium text-center mb-8">
          Select your medications
        </h1>

        {/* Alphabet Filter and Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${selectedLetter === letter 
                    ? 'bg-[#4F3222] text-white' 
                    : 'hover:bg-[#4F3222]/10'
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search for medication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-full bg-white border border-[#E0D5C6] focus:outline-none focus:border-[#4F3222] w-64"
          />
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Medications List */}
          <div 
            ref={listRef}
            className="flex-1 bg-white rounded-2xl p-4 h-[500px] overflow-y-auto shadow-md"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4F3222 #E0D5C6'
            }}
          >
            {Object.entries(groupedMedications).map(([letter, meds]) => (
              <div key={letter} id={`section-${letter}`}>
                <h2 className="text-lg font-bold mb-2 sticky top-0 bg-white py-2">
                  {letter}
                </h2>
                {meds.map(medication => (
                  <div
                    key={medication}
                    id={`med-${medication.replace(/\s+/g, '-')}`}
                    onClick={() => handleMedicationSelect(medication)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer mb-2 transition-all
                      ${selectedMeds.includes(medication) ? 'bg-[#C5DAB7]' : 'hover:bg-[#F9F6F2]'}
                    `}
                  >
                    <span className="font-medium">{medication}</span>
                    <div className={`w-5 h-5 rounded-full border-2 border-[#4F3222] flex items-center justify-center
                      ${selectedMeds.includes(medication) ? 'bg-[#4F3222]' : 'bg-white'}
                    `}>
                      {selectedMeds.includes(medication) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Selected Medications */}
          <div className="w-80 bg-white rounded-2xl p-4 h-[500px] shadow-md">
            <h2 className="text-lg font-bold mb-4">Selected Medications</h2>
            <div className="space-y-2">
              {selectedMeds.map(medication => (
                <div
                  key={medication}
                  id={`selected-${medication.replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between p-3 bg-[#F9F6F2] rounded-xl"
                >
                  <span className="font-medium">{medication}</span>
                  <button
                    onClick={() => handleRemoveMedication(medication)}
                    className="w-6 h-6 rounded-full hover:bg-[#E0D5C6] flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            className={`px-8 py-3 rounded-full text-white bg-[#4F3222] hover:opacity-90 transition-all
              ${selectedMeds.length === 0 && 'opacity-50 cursor-not-allowed'}
            `}
            disabled={selectedMeds.length === 0}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicationSelection; 