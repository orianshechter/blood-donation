import React, { Component, useState, useMemo } from "react";
import GoogleMapReact from "google-map-react";
import MarkerIcon from "@material-ui/icons/Room";
import { IconButton } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InfoWindowTable from './Table'

// popover styles
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function MarkerAndInfo() {
  const [MarkerColor, setMarkerColor] = useState("secondary");
  const [anchorEl, setAnchorEl] = useState(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = useMemo(() => (open ? "simple-popover" : undefined), [open]);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMarkerColor("primary");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMarkerColor("secondary");
  };

  return (
    <div>
      <IconButton size="small">
        <MarkerIcon onClick={handleClick} color={MarkerColor} fontSize="large" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
       
        <Typography className={classes.typography}>
          <InfoWindowTable /> {/* content of the info window */}
        </Typography>
      </Popover>
    </div>
  );
}

export default MarkerAndInfo;
