# Gear Box System Testing Guide

## Testing the Complete Gear Box Workflow

### 1. **Test Gear Management (Gear Page)**
- Navigate to `/gear`
- **Test Gear Boxes Tab**: Click on "Gear Boxes" tab
- **Create a Gear Box**: 
  - Click "Create Gear Box" button
  - Fill in name: "Vocal Microphone Kit"
  - Fill in description: "Complete vocal recording setup"
  - Select multiple gear items (microphones, cables, etc.)
  - Click "Create Box"
- **Verify Box Creation**: Should see the new gear box in the list
- **Test Box Details**: Click the eye icon to expand/collapse box contents
- **Test Box Editing**: Click edit icon, modify details, save changes
- **Test Conflict Prevention**: Try to create another box with gear already in the first box (should only show available gear)

### 2. **Test Event Gear Assignment (Event Page)**
- Navigate to an event (e.g., `/events/[event-id]`)
- **Test Gear Assignment Modal**: Click "Add Gear" button
- **Test Individual Gear Tab**: 
  - Should only show gear NOT in boxes
  - Select some individual gear items
  - Assign quantities and team members
  - Click "Assign Gear"
- **Test Gear Boxes Tab**:
  - Switch to "Gear Boxes" tab
  - Should show all available gear boxes
  - Select one or more gear boxes
  - Assign to team members
  - Click "Assign Gear Boxes"
- **Verify Event Display**: 
  - Should show both individual gear and gear boxes separately
  - Individual gear section with 🎸 icon
  - Gear boxes section with 📦 icon
  - Different styling (purple for boxes, gray for individual)

### 3. **Test Conflict Prevention**
- Create gear and add to a box
- Try to assign the same gear individually to an event
- Should NOT appear in available individual gear
- Only the box containing it should be available

### 4. **Test Data Persistence**
- Refresh the page
- Navigate away and back
- All gear box assignments should persist
- Box contents should remain consistent

## Expected Behavior

### Gear Page
- Three tabs: "Owned Gear", "Wishlist", "Gear Boxes"
- Gear boxes show with 📦 icon and purple styling
- Available gear for box creation excludes gear already in other boxes
- Box creation form shows checkboxes for each available gear item

### Event Page
- Gear section shows both individual gear and gear boxes
- Assignment modal has two tabs: "Individual Gear" and "Gear Boxes"
- Individual gear only shows gear NOT in boxes
- Gear boxes show box name, item count, and description
- Different visual styling for boxes vs individual gear

### Conflict Prevention
- Gear in boxes cannot be assigned individually
- Available gear calculations exclude boxed gear
- Box creation only shows unboxed gear

## Test Data Setup
1. Create several gear items (microphones, cables, instruments)
2. Create 2-3 gear boxes with different types of gear
3. Create an event
4. Test assigning both individual gear and gear boxes
5. Verify conflict prevention works
