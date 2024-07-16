const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.get('/api/graph-data', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'intention_space_data.json'), 'utf8');
    const jsonData = JSON.parse(data);

    const nodes = [
      ...jsonData.designChunks.map(dc => ({ ...dc, type: 'design_chunk' })),
      ...jsonData.intentions.map(i => ({ ...i, type: 'intention', name: i.description })),
      ...jsonData.objects.map(o => ({ ...o, type: 'object' }))
    ];

    const edges = [
      ...jsonData.intentions
        .filter(i => i.emitter_id)
        .map(i => ({ source: i.emitter_id, target: i.id, label: 'emits' })),
      ...jsonData.intentions
        .filter(i => i.receiver_id)
        .map(i => ({ source: i.id, target: i.receiver_id, label: 'received_by' })),
      ...jsonData.intentionObjectMappings
        .map(iom => ({ source: iom.intention_id, target: iom.object_id, label: 'reflected_by' })),
      ...jsonData.intentionObjectMappings
        .filter(iom => iom.reflected_intention_id)
        .map(iom => ({ source: iom.object_id, target: iom.reflected_intention_id, label: 'reflects' }))
    ];

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Error fetching graph data');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));