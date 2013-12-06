
--a 
select         ---- sql start
col1 as b,--- b   
----- comment here
col2 as c-- co2 comment
from table
where 1 = 1
<% if (a) { %>
  and a = :a
<% } %>
<%
  if (isEmpty('notExistKey')) {
%>
  -- not exist key
<%
  }
%>
;
