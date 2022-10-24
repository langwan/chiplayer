import { Box, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";

const start = "start";
const editing = "editing";
const end = "end";

export const ChihuoEditText = ({ name, isEdit, content, onSave }) => {
  const ref = useRef();
  const [value, setValue] = useState(start);
  const [editState, setEditState] = useState(end);

  useEffect(() => {
    switch (editState) {
      case start:
        ref.current.select();
        ref.current.focus();
        setEditState(editing);
        break;
    }
  }, [editState]);

  useEffect(() => {
    console.log("setValue");
    setValue(content);
  }, [content]);

  return (
    <Fragment>
      {editState != end ? (
        <TextField
          onBlur={(event) => {
            console.log("key", name);
            setEditState(end);
            onSave(name, value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              console.log("key", name);
              setEditState(end);
              onSave(name, value);
            } else if (event.key === "Escape") {
              setEditState(end);
            }
          }}
          inputRef={ref}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
            },
            "& .MuiOutlinedInput-input": {
              padding: 0,
              p: 1,
            },
          }}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      ) : (
        <Box
          component={"div"}
          onDoubleClick={(event) => {
            setEditState(start);
          }}
        >
          <Typography>{content}</Typography>
        </Box>
      )}
    </Fragment>
  );
};
