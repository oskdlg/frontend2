// src/pages/PeopleGroups.jsx
import React, { useState } from 'react';
import { useLoanData } from '../context/LoanContext';
import { v4 as uuidv4 } from 'uuid';

export default function PeopleGroups() {
  const { people, groups, addPerson, addGroup } = useLoanData();
  const [activeTab, setActiveTab] = useState('people');

  // Local state for forms
  const [newPersonName, setNewPersonName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // --- Handlers ---

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    const newPerson = {
      id: uuidv4(),
      name: newPersonName.trim(),
    };
    
    addPerson(newPerson);
    setNewPersonName('');
  };

  const handleToggleMember = (personId) => {
    setSelectedMembers((prev) => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId) 
        : [...prev, personId]
    );
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedMembers.length === 0) {
      alert("Please provide a group name and select at least one member.");
      return;
    }

    // Map selected IDs back to full person objects for easier rendering later
    const groupMembers = selectedMembers.map(id => 
      people.find(p => p.id === id)
    );

    const newGroup = {
      id: uuidv4(),
      name: newGroupName.trim(),
      members: groupMembers,
    };

    addGroup(newGroup);
    setNewGroupName('');
    setSelectedMembers([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">People & Groups</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'people' ? 'border-b-2 border-white text-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}
          onClick={() => setActiveTab('people')}
        >
          Individuals
        </button>
        <button
          className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'groups' ? 'border-b-2 border-white text-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
      </div>

      {/* Tab Content: PEOPLE */}
      {activeTab === 'people' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Person Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-mauve-800 font-bold mb-4">Add New Person</h3>
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newPersonName} 
                  onChange={(e) => setNewPersonName(e.target.value)} 
                  className="mt-1 w-full border rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="e.g. Eugene Krabs" 
                />
              </div>
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-full transition">
                Add Person
              </button>
            </form>
          </div>

          {/* People List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-mauve-800 font-bold mb-4">Saved Contacts ({people.length})</h3>
            {people.length === 0 ? (
              <p className="text-gray-500 italic">No contacts added yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {people.map((person) => (
                  <li key={person.id} className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{person.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: GROUPS */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Group Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-mauve-800 font-bold mb-4">Create New Group</h3>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Group Name</label>
                <input 
                  type="text" 
                  required
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)} 
                  className="mt-1 w-full border rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" 
                  placeholder="e.g. CMSC121 Support Group" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Members</label>
                {people.length === 0 ? (
                  <p className="text-sm text-red-500 italic">Please add individuals first.</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50">
                    {people.map((person) => (
                      <label key={person.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-100 rounded">
                        <input 
                          type="checkbox" 
                          checked={selectedMembers.includes(person.id)}
                          onChange={() => handleToggleMember(person.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="text-gray-700">{person.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={people.length === 0}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </form>
          </div>

          {/* Groups List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-mauve-800 font-bold mb-4">Saved Groups ({groups.length})</h3>
            {groups.length === 0 ? (
              <p className="text-black italic">No groups created yet.</p>
            ) : (
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {groups.map((group) => (
                  <li key={group.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                    <div className="font-bold text-black mauve-800">{group.name}</div>
                    <div className="text-sm text-black mt-1">
                      {group.members.length} member{group.members.length !== 1 && 's'}: 
                      {' ' + group.members.map(m => m.name).join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}