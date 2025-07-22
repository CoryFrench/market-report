import React from 'react';

function FeaturedProperty({ property }) {
  if (!property) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ marginBottom: '40px' }}>
      <tbody>
        <tr>
          <td style={{ background: 'transparent' }} align="center">
            <table 
              cellPadding="0" 
              cellSpacing="0" 
              border="0" 
              width="700" 
              style={{ 
                backgroundColor: '#eee', 
                border: '4px double #ccc', 
                color: '#004a73', 
                padding: '10px 30px 20px', 
                width: '100%', 
                marginBottom: '0', 
                maxWidth: '700px', 
                backgroundColor: '#eee' 
              }}
            >
              <tbody>
                <tr>
                  <td colSpan="2" style={{ backgroundColor: '#eee' }}>
                    <h1 style={{ 
                      fontFamily: 'arial, helvetica, sans-serif', 
                      color: '#003366', 
                      textAlign: 'center', 
                      margin: '5px 0', 
                      fontSize: '28px', 
                      marginBottom: '10px' 
                    }}>
                      This Month's Featured Property
                    </h1>
                  </td>
                </tr>
                <tr>
              <td 
                style={{ 
                  width: '50%', 
                  padding: '0 10px 0 0', 
                  backgroundColor: '#eee' 
                }} 
                align="center"
              >
                <div 
                  style={{ 
                    display: 'block', 
                    background: '#fff', 
                    padding: '6px 7px', 
                    border: '1px solid #ccc',
                    height: '214px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏠</div>
                    <div style={{ fontSize: '14px' }}>Property Image</div>
                  </div>
                </div>
              </td>
              <td style={{ width: '50%', backgroundColor: '#eee' }}>
                <table>
                  <tbody>
                    <tr>
                      <td 
                        style={{ 
                          font: 'normal 13px arial, verdana, sans-serif', 
                          textAlign: 'left', 
                          fontWeight: 'bold', 
                          padding: '8px 0 8px 8px', 
                          fontSize: '16px', 
                          backgroundColor: '#eee' 
                        }} 
                        colSpan="2"
                      >
                        {property.address}
                      </td>
                    </tr>
                  <tr>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        width: '30%', 
                        fontSize: '0.8em', 
                        textTransform: 'uppercase', 
                        color: '#777', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      Price:
                    </td>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      {formatPrice(property.listPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        width: '30%', 
                        fontSize: '0.8em', 
                        textTransform: 'uppercase', 
                        color: '#777', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      Beds:
                    </td>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      {property.bedrooms}
                    </td>
                  </tr>
                  <tr>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        width: '30%', 
                        fontSize: '0.8em', 
                        textTransform: 'uppercase', 
                        color: '#777', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      Baths:
                    </td>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      {property.bathrooms}
                    </td>
                  </tr>
                  <tr>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        width: '30%', 
                        fontSize: '0.8em', 
                        textTransform: 'uppercase', 
                        color: '#777', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      Sub:
                    </td>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        textAlign: 'left', 
                        padding: '8px', 
                        backgroundColor: '#eee' 
                      }}
                    >
                      {property.subdivision}
                    </td>
                  </tr>
                  <tr>
                    <td 
                      style={{ 
                        font: 'normal 13px arial, verdana, sans-serif', 
                        padding: '8px', 
                        fontStyle: 'italic', 
                        textAlign: 'center', 
                        backgroundColor: '#eee' 
                      }} 
                      colSpan="2"
                    >
                      <a 
                        href={`https://waterfront-properties.com/listing/${property.id.toLowerCase()}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Click Here for More Information &raquo;
                      </a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>
  );
}

export default FeaturedProperty; 