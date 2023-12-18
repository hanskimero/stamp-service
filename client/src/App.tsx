import React, { useRef, useState, useEffect } from 'react';
import {Alert, Button, Container, FormControl, FormLabel, FormControlLabel, RadioGroup, Grid, Radio, Typography, Paper, Stack, TextField, Card, CardMedia, CardContent, Slider, InputLabel} from '@mui/material'; 

interface Postimerkki {
  id : number
  asiasanat? : string
  ilmestymispaiva? : string
  kaytonPaattyminen? : string
  nimellisarvo? : number
  merkinNimi? : string
  merkinVari? : string
  painopaikka? : string
  painosmaara : number
  taiteilija? : string
  valuutta? : string
  kuvanUrl? : string
  ilmestymisvuosi? : number
}

const App : React.FC = () : React.ReactElement => {

  const formRef = useRef<any>();
  const [postimerkit, setPostimerkit] = useState<Postimerkki[]>([]);
  const [timespan, setTimespan] = useState<number[]>([1856, 2020]);
  const [error, setError] = useState<string>("");

  const startQuery = async (e : React.FormEvent) : Promise<void> => {
    
    setError("");

    e.preventDefault();

    const hakusana = formRef.current.hakusana.value;
    const hakukohde = formRef.current.hakukohde.value || "asiasanat"; 

    if (formRef.current.hakusana.value.length >= 2) {
      
      try {

        let url : string = `/api/postimerkit?hakusana=${hakusana}&hakukohde=${hakukohde}&timespan=${timespan[0]},${timespan[1]}`;

        const connection = await fetch(url);
    
        
        if (connection.ok) {

          const queryResult : Postimerkki[] = await connection.json();
    
          if (queryResult.length === 0) {

            setError(`Hakusanalla ei löytynyt yhtään postimerkkiä.`)

          } else {
            
            setPostimerkit(queryResult)

            setError("");
          }

        } else {

          switch (connection.status) {

            case 400 : setError("Virheellinen hakusana"); break;
            default : setError("Palvelimella tapahtui odottamaton virhe"); break;
  
          }

        }     

    } catch (e: any) {

      setError("Palvelimelle ei saada yhteyttä.")

    }    

    } else {
      setError('Syötetyn hakusana on oltava vähintään kaksi merkkiä pitkä.')
    }

  }

  useEffect(() => {
    
  }, [postimerkit]);

  return (
    <Container>

      <Typography variant="h5" sx={{marginBottom: 2}}>Oppimistehtävä 8: SQL-kyselyt</Typography>
      
      <Typography variant="h6" sx={{marginBottom: 2}}>Postimerkkihaku</Typography>

      <Paper 
        component="form"
        onSubmit={startQuery}
        ref={formRef}
        elevation={2}
        sx={{ padding : 2 , marginBottom: 2}}
      >
        <Stack spacing={2}>

          <Grid container spacing={1}>

            <Grid item xs={10}>

              <TextField 
                name="hakusana"
                variant="outlined"
                size="small"
                fullWidth={true}
                placeholder="Hakusana tähän..."
              />

            </Grid>
            <Grid item xs={2}>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={true}
              >Hae</Button>

            </Grid>
          </Grid>

          <FormControl>
            <FormLabel>Haun kohde</FormLabel>
            <RadioGroup
              row
              name="hakukohde"
            >
              <FormControlLabel value="asiasanat" control={<Radio defaultChecked />} label="Asiasanat" />
              <FormControlLabel value="merkinNimi" control={<Radio />} label="Merkin nimi" />
              <FormControlLabel value="taiteilija" control={<Radio />} label="Taiteilija" />
            </RadioGroup>
          </FormControl>

          <InputLabel htmlFor="timespan-slider" sx={{ marginBottom: 1 }}>
            Aikajana
          </InputLabel>

          <Slider
            value={timespan}
            onChange={(event, newValue: number | number[]) => {
          
              if (Array.isArray(newValue) && newValue.length === 2 && typeof newValue[0] === 'number' && typeof newValue[1] === 'number') {
                setTimespan(newValue);
              }
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => v.toString()}
            min={1856}
            max={2020}
            step={1}
          />

        </Stack>

      </Paper>

      {Boolean(error) ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {postimerkit.slice(0, 40).map((postimerkki: Postimerkki, index: number) => (
            <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
              <Card>
                {postimerkki.kuvanUrl && (
                  <CardMedia component="img" height="140" image={postimerkki.kuvanUrl} alt={postimerkki.merkinNimi} />
                )}
                <CardContent>
                  <Typography variant="h6">{postimerkki.merkinNimi}</Typography>
                  <Typography>{`${postimerkki.nimellisarvo} ${postimerkki.valuutta}`}</Typography>
                  <Typography>{`Painosmäärä: ${postimerkki.painosmaara}`}</Typography>
                  <Typography>{`Taiteilija: ${postimerkki.taiteilija}`}</Typography>
                  <Typography>{`Ilmestymisvuosi: ${postimerkki.ilmestymisvuosi}`}</Typography>
                  <Typography>{`Asiasanat: ${postimerkki.asiasanat}`}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {postimerkit.length > 40 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="error">
                Haulle löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

    </Container>
  );
}

export default App;

