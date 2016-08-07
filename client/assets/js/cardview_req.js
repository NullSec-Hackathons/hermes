for(i=0;i<requesters.length;++i){
  var matchval = 0;
  for(j=0;j<6;++j)
  {
    if(requesters[i].hla[j]==donor[0].hla[j])
      ++matchval;
  }
  matchval = (matchval / 6)*100;
  $("#cards").append(`
    <div class="col s12 m4">
       <div class="card-panel teal">
          <table class="white-text" style="padding-top:0px">
             <tr>
                <b>
                   <th>Match:</td>
                   <th> ${matchval}</th>
                </b>
             </tr>
             <br>
             <tr>
                <td>Name:</td>
                <td>Shantanu Agarwal</td>
             </tr>
             <tr>
                <td>Contact:</td>
                <td>9958818058</td>
             </tr>
             <tr>
                <td>Address:</td>
                <td> ND-09, Satpura Boys Hostel, IIT Delhi, Delhi</td>
             </tr>
          </table>
       </div>
    </div>
    `);
}
