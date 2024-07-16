const express = require('express');
const {Spanner} = require('@google-cloud/spanner');

const app = express();

app.get('/api/graph-data', async (req, res) => {
  const spanner = new Spanner();
  const instance = spanner.instance('your-instance');
  const database = instance.database('your-database');

  try {
    const [nodes] = await database.run(`
      SELECT id, name, 'design_chunk' as type FROM design_chunks
      UNION ALL
      SELECT id, description as name, 'intention' as type FROM intentions
      UNION ALL
      SELECT id, name, 'object' as type FROM objects
    `);

    const [edges] = await database.run(`
      SELECT emitter_id as source, id as target, 'emits' as label
      FROM intentions WHERE emitter_id IS NOT NULL
      UNION ALL
      SELECT id as source, receiver_id as target, 'received_by' as label
      FROM intentions WHERE receiver_id IS NOT NULL
      UNION ALL
      SELECT intention_id as source, object_id as target, 'reflected_by' as label
      FROM intention_object_mappings
      UNION ALL
      SELECT object_id as source, reflected_intention_id as target, 'reflects' as label
      FROM intention_object_mappings WHERE reflected_intention_id IS NOT NULL
    `);

    res.json({ nodes, edges });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching graph data');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));