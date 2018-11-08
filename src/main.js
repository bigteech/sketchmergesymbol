const sketch = require('sketch')
var ui = require('./ui')
var UI = require('sketch/ui')
var dom = require('sketch/dom')

function changePage(one, from_ids, to_id) {
  let document = dom.getSelectedDocument();
  if(from_ids.indexOf(one.symbolId) > -1) {
    one.symbolId = to_id;
  }
  one.layers && one.layers.forEach(y => changePage(y, from_ids, to_id))
}

export default function(context) {
  const document = sketch.fromNative(context.document)
  const selection = document.selectedLayers
  let dialog = ui.dialog('合并', '');
  let checkboxs = []
  selection.forEach(x => {
    let checkbox = ui.checkbox(false, x.name);
    checkboxs.push(checkbox)
    dialog.addAccessoryView(checkbox);
  })

  let responseCode = dialog.runModal();

  if (responseCode === 1000) {
      let selected = null;
      let index = 0;
      let selectedIndex = 0;
      selection.forEach((x) => {
        if (parseInt((checkboxs[index].stringValue()))) {
          selected = x;
          selectedIndex = index;
        }
        index++;
      })
      let index2 = 0;
      let otherIds = [];
      selection.forEach(x => {
        if (index2 === selectedIndex) {
          index2++;
          return;
        }
        
        otherIds.push(x.symbolId);
        try {
          x.parent = null;
        }catch(e){
            UI.alert('error', e.toString())
        }
        index2++;
      })

      try{
        let document = dom.getSelectedDocument();
        document.pages.forEach(x => {
          changePage(x, otherIds, selected.symbolId);
        })
      }catch(e){
        UI.alert('error',e.toString());
      }
  }
}
