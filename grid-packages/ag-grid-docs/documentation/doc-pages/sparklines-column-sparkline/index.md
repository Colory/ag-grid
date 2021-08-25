---
title: "Sparklines - Column Sparkline"
enterprise: true
---

This section introduces the Column Sparkline

## Enabling Sparklines

TODO:

<snippet>
const gridOptions = {
    columnDefs: [
        {
            field: 'results',
            cellRenderer: 'agSparklineCellRenderer',
            cellRendererParams: {
                sparklineOptions: {
                    type: 'column',
                    strokeWidth: 1,
                    paddingInner: 0.7,
                    paddingOuter: 0.2,
                    formatter: formatter,
                    highlightStyle: {
                        strokeWidth: 1,
                    }
                }
            },
        },
        // other column definitions ...
    ],
};
</snippet>

<interface-documentation interfaces='["AgSparklineOptions", "AgColumnSparklineOptions"]' ></interface-documentation>


<grid-example title='Column Sparkline' name='column-sparkline' type='generated' options='{ "enterprise": true, "exampleHeight": 585, "modules": ["clientside", "sparklines"] }'></grid-example>


## Next Up

Continue to the next section to learn about the: [Data Updates](/sparklines-data-updates/).