# Ayushmaan Bazar App Flow

## Screen-by-Screen User Journey

### 1. Authentication & Onboarding
- **Login Screen**: Users authenticate via Internet Identity
- **Profile Setup Modal**: First-time users provide name, optional mobile number, and optional referral code
- Language preference can be set in Support settings (English/Hindi)

### 2. Home Screen
- Welcome message and quick action cards
- Browse Categories, Compare Policies, View Rewards, Need Help
- Compliance note displayed prominently
- Link to Disclaimer page
- Bottom navigation: Home, Categories, Compare, Rewards, Support

### 3. Categories Screen
- Grid of 6 insurance categories with icons:
  - Life Insurance
  - Health Insurance
  - Motor Insurance
  - Term Plan
  - Travel Insurance
  - General Insurance
- Tap any category to view policies

### 4. Category Policies Screen
- List of policies in selected category
- Each policy card shows: name, premium, coverage, benefits
- Actions: View Details, Apply Now, Add/Remove from Compare
- Floating compare button when 2+ policies selected

### 5. Policy Detail Screen
- Full policy information: premium, coverage, benefits
- Compliance note about informational nature
- Actions: Apply Now, View Disclaimer

### 6. Compare Screen
- Shows selected policies count
- Compare Now button (requires 2+ policies)
- Clear All option

### 7. Compare Detail Screen
- Side-by-side comparison of selected policies
- Premium, coverage, benefits for each
- Apply Now button for each policy
- Compliance note about informational comparison

### 8. Lead Form Screen
- Apply for a specific policy
- Form fields: name, mobile, preferred contact time, notes
- Submit creates lead record
- Success confirmation screen

### 9. Rewards Screen
- Current Reward Benefit balance (promotional)
- Referral program section with user's code
- Option to enter referral code (one-time)
- Recent activity list
- Compliance note about promotional nature

### 10. Support Screen
- Language toggle (English/Hindi)
- FAQ accordion
- Callback request form
- Contact form for support messages

### 11. Notifications Screen
- In-app notifications only
- List of offers and policy status updates
- Categorized by insurance type

### 12. Disclaimer Screen
- Insurance Facilitator statement
- Reward Benefits explanation
- No Guaranteed Returns clause
- IRDAI Compliance information

## Navigation Flow
- Persistent bottom tabs on all primary screens
- Back buttons on detail/form screens
- Deep linking support for all routes
- Logout clears all cached data

## Bilingual Support
- All screens available in English and Hindi
- Language toggle in Support settings
- Preference persisted in localStorage
- Compliance messaging in both languages
