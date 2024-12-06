import React from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const FilterModal = ({
  filterModalOpen,
  setFilterModalOpen,
  modes,
  categories,
  modalSelectedModes,
  setModalSelectedModes,
  modalSelectedCategory,
  setModalSelectedCategory,
  modalResolvedFilter,
  setModalResolvedFilter,
  modalShowSaved,
  setModalShowSaved,
  handleFilterApply
}) => {
  return (
    <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
      <DialogTitle>Filter Issues</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Modes
        </Typography>
        <ToggleButtonGroup
          value={modalSelectedModes}
          onChange={(event, newModes) => setModalSelectedModes(newModes)}
          aria-label="Mode selection"
          size="small"
          sx={{ display: "flex", flexWrap: "wrap" }}
        >
          {modes.map((mode) => (
            <ToggleButton key={mode} value={mode} sx={{ minWidth: "80px" }}>
              {mode}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Category
        </Typography>
        <Select
          fullWidth
          value={modalSelectedCategory}
          size="small"
          onChange={(e) => setModalSelectedCategory(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Resolution Status
        </Typography>
        <ToggleButtonGroup
          value={modalResolvedFilter}
          exclusive
          onChange={(event, newStatus) => setModalResolvedFilter(newStatus)}
          aria-label="Resolution status"
          size="small"
        >
          <ToggleButton value="all" sx={{ minWidth: "80px" }}>
            All
          </ToggleButton>
          <ToggleButton value="resolved">Resolved</ToggleButton>
          <ToggleButton value="unresolved">Unresolved</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Show Saved
        </Typography>
        <ToggleButtonGroup
          value={modalShowSaved ? "true" : "false"}
          exclusive
          onChange={() => setModalShowSaved((prev) => !prev)}
          aria-label="Saved filter"
          size="small"
        >
          <ToggleButton value="false" sx={{ minWidth: "130px" }}>
            All Issues
          </ToggleButton>
          <ToggleButton value="true" sx={{ minWidth: "130px" }}>
            Saved Issues
          </ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
        <Button onClick={handleFilterApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
