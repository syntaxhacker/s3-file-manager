import axios from 'axios';
import React, { useEffect, useState } from 'react';
import S3Table from './components/S3Table';
import FileUploader from './components/FileUploader';
import { Box, ChakraProvider, Spacer, theme } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  const [tableBody, setTableBody] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/db');
      setTableBody(data);
    })();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Box p="10">
        <Box textAlign="end">
          <ColorModeSwitcher justifySelf="flex-end" />
        </Box>
        <Box textAlign="center">
          <FileUploader setTableBody={setTableBody}></FileUploader>
          {tableBody.length ? (
            <S3Table
              tableBody={tableBody}
              setTableBody={setTableBody}
            ></S3Table>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
