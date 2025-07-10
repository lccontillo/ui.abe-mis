In DocumentSchema at the bottom of each field, add a section where the field_label is formed in pascal case with curly braces, for instance:

{{FieldLabel}}     [Copy]

The copy button will be copy "FieldLabel", which can be pasted to a word document.

If Field Type is table, form it as:

----------------------------------------------------------
| Column Label 1                | Column Label 2         |
----------------------------------------------------------
| {{FOR row IN             |                             |
| FieldLabel}}             |                             |
----------------------------------------------------------
| {{= $row.ColumnLabel1}}  | {{= $row.ColumnLabel2}}     |
----------------------------------------------------------
| {{END-FOR row}}         |                              |
----------------------------------------------------------

[Copy]


The table can be copied like in this code:


<!DOCTYPE html>
<html>
  <head>
    <title>Copy Table to Word</title>
    <style>
      #myTable,
      #myTable th,
      #myTable td {
        border: 1px solid black;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        padding: 6px;
      }

      #myTable {
        box-shadow: none;
        font-size: 14px;
      }

      button {
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <table id="myTable">
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
      <tr>
        <td>Alice</td>
        <td>30</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>25</td>
      </tr>
    </table>

    <button onclick="copyTable()">Copy Table</button>

    <script>
      function copyTable() {
        const table = document.getElementById("myTable");

        // Create a clone to apply inline styles
        const clone = table.cloneNode(true);

        // Ensure all inline styles are retained (since Word might ignore CSS)
        clone.querySelectorAll("th, td").forEach((cell) => {
          cell.style.fontFamily = "Arial";
          cell.style.border = "1px solid black";
          cell.style.padding = "6px";
        });
        clone.style.borderCollapse = "collapse";
        clone.style.fontFamily = "Arial";

        const container = document.createElement("div");
        container.appendChild(clone);
        document.body.appendChild(container);

        const range = document.createRange();
        range.selectNode(container);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
          document.execCommand("copy");
          alert("Table copied! You can now paste it into Word.");
        } catch (err) {
          alert("Copy failed.");
        }

        selection.removeAllRanges();
        document.body.removeChild(container); // Cleanup
      }
    </script>
  </body>
</html>
