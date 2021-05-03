import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import TableRow from './TableRow';

function S3Table(props) {
  const { tableBody, setTableBody } = props;

  return (
    <Table variant="simple" size="lg">
      <TableCaption fontSize="4xl" fontWeight="bold" placement="top">
        S3 files viewer
      </TableCaption>
      <Thead>
        <Tr>
          <Th>id</Th>
          <Th>name</Th>
          <Th>size</Th>
          <Th>s3_url</Th>
          <Th>created_on</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tableBody
          ? tableBody.map((bodyRowItem, index) => {
              return (
                <TableRow
                  key={index}
                  data={bodyRowItem}
                  setTableBody={setTableBody}
                />
              );
            })
          : ''}
      </Tbody>
    </Table>
  );
}

export default S3Table;
