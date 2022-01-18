import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Chip, Card, Box, Typography, Fab, CircularProgress, Switch, CardContent, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import { getLookups, genericFunctionThreeParameters, postCalving, getAgents, getParametersLimitAll, getLactationNumber, genericFunctionFourParameters } from '../../../../../../utils/API';
import { endpoint_lookup, endpoint_gen_tag_id, endpoint_calving_add, endpoint_agent, endpoint_parameter_limit_all, endpoint_get_lactation_number, endpoint_dp_validations } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { MultiSelect } from '../../../../../../components';
import { Sidebar } from '../index';
import moment from 'moment';
import { EventValidation } from '../../../ValidationMessages';
import { Page } from 'components';
import { Header } from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  chips: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(1)
  },
  selects: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: colors.grey[50],
    padding: theme.spacing(1)
  },
}));

const Edit = props => {
  const { className, ...rest } = props;
  const [{ user_id, organization_id }] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [body_scores, setBodyScores] = useState([]);
  const [colors, setColors] = useState([]);
  const [deformaties, setDeformaties] = useState([]);
  const [genders, setGenders] = useState([]);
  const [birth_types, setBirthTypes] = useState([]);
  const [calving_methods, setCalvingMethods] = useState([]);
  const [calving_types, setCalvingTypes] = useState([]);
  const [calving_ease, setCalvingEase] = useState([]);
  const [calving_status, setCalvingStatus] = useState([]);
  const [uses_of_calf, setCalfUses] = useState([]);
  const [agents, setAgents] = useState([]);
  const [lactation_number, setLactationNo] = useState(null);
  const [tag, setTag] = useState(null);
  const [tag2, setTag2] = useState(null);
  const [tagInputStatus, setTagInputStatus] = useState(false);
  const [tagInputStatus2, setTagInputStatus2] = useState(false);
  const [validations, setValidations] = useState([]);
  const [override, setOverride] = useState(false);
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const animal_id = localStorage.getItem('animal_id');
  const animal_tag = sessionStorage.getItem('animal_tag');
  const dob = sessionStorage.getItem('animal_dob');
  const option = 0;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const [deformatiesValueAttribute, setDeformatiesValueAttribute] = useState([]);
  const [colorsValueAttribute, setColorsValueAttribute] = useState([]);
  const [chipsDeformaties, setChipsDeformaties] = useState([]);
  const [chipsColor, setChipsColor] = useState([]);


  const [deformatiesValueAttribute2, setDeformatiesValueAttribute2] = useState([]);
  const [colorsValueAttribute2, setColorsValueAttribute2] = useState([]);
  const [chipsDeformaties2, setChipsDeformaties2] = useState([]);
  const [chipsColor2, setChipsColor2] = useState([]);

 

  function key_value_array_search(option, array_search_values, array_search_terms) {
    /**
     * option 1 > get keys based on values
     * option 2 > get values based on keys
     */
    let results = [];

    if (option === 1) {
      if (array_search_values.length > 0) {
        if (array_search_terms.length > 0) {
          for (let i = 0; i < array_search_terms.length; i++) {
            results.push(array_search_values.find(x => x.value === array_search_terms[i]).id)
          }
        }
      }
    } else {
      if (array_search_values.length > 0) {
        if (array_search_terms.length > 0) {
          for (let i = 0; i < array_search_terms.length; i++) {
            results.push(array_search_values.find(x => x.value === array_search_terms[i]).id)
          }
        }
      }
    }
    return results;
  }

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });



  useEffect(() => {
    let mounted_lookup = true;
    let mounted_agents = true;
    let mounted_limit_parameters = true;
    let mounted_lactation_no = true;
    let mounted_validations = true;

    /**
   * Check event Calving validations
   * Animal should be cow or heifer    
   */
    (async (endpoint, desc, option, id) => {
      await genericFunctionFourParameters(endpoint, desc, option, id)
        .then(response => {
          if (mounted_validations) {
            setValidations(response.payload);
          }
        });
    })(endpoint_dp_validations, 'event-calving-validation', 4, animal_id);


    (async (endpoint, id) => {
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {

            const data = response.payload[0];
            let lookup_colors = [];
            let lookup_deformaties = [];
            let lookup_genders = [];
            let lookup_birth_types = [];
            let lookup_calving_methods = [];
            let lookup_calving_type = [];
            let lookup_ease_of_calving = [];
            let lookup_calving_status = [];
            let lookup_use_of_calf = [];
            let lookup_body_scores = [];


            for (let i = 0; i < data.length; i++) {
              //birth Types
              if (data[i].list_type_id === 20) {
                lookup_birth_types.push(data[i]);
              }
              //calving Methods
              if (data[i].list_type_id === 15) {
                lookup_calving_methods.push(data[i]);
              }
              //Birth Types
              if (data[i].list_type_id === 16) {
                lookup_calving_type.push(data[i]);
              }

              //Ease of Calving
              if (data[i].list_type_id === 19) {
                lookup_ease_of_calving.push(data[i]);
              }
              //Calving Status
              if (data[i].list_type_id === 22) {
                lookup_calving_status.push(data[i]);
              }
              //Use of calf
              if (data[i].list_type_id === 21) {
                lookup_use_of_calf.push(data[i]);
              }
              if (data[i].list_type_id === 71) {
                lookup_body_scores.push(data[i]);
              }
              //colors
              if (data[i].list_type_id === 83) {
                lookup_colors.push(data[i]);
              }

              //deformaties
              if (data[i].list_type_id === 11) {
                lookup_deformaties.push(data[i]);
              }

              //genders
              if (data[i].list_type_id === 3) {
                lookup_genders.push(data[i]);
              }

            }

            setBodyScores(lookup_body_scores);
            setColors(lookup_colors);
            setDeformaties(lookup_deformaties);
            setGenders(lookup_genders);
            setBirthTypes(lookup_birth_types);
            setCalvingMethods(lookup_calving_methods);
            setCalvingTypes(lookup_calving_type);
            setCalvingEase(lookup_ease_of_calving);
            setCalvingStatus(lookup_calving_status);
            setCalfUses(lookup_use_of_calf);

            let arr_deformaties = [];
            for (let r = 0; r < lookup_deformaties.length; r++) {
              arr_deformaties.push(lookup_deformaties[r].value);
            }
            let arr_colors = [];
            for (let r = 0; r < lookup_colors.length; r++) {
              arr_colors.push(lookup_colors[r].value);
            }
            setDeformatiesValueAttribute(arr_deformaties);
            setColorsValueAttribute(arr_colors);

            setDeformatiesValueAttribute2(arr_deformaties);
            setColorsValueAttribute2(arr_colors);


          }
        });
    })(endpoint_lookup, '20,15,16,19,22,21,71,83,11,3');

    (async (endpoint, org_id, option) => {
      await getAgents(endpoint, org_id, option)
        .then(response => {
          if (mounted_agents) {
            setAgents(response.payload);
          }
        });
    })(endpoint_agent, organization_id, option);
    // get limit parameters for input validation
    (async (endpoint) => {
      await getParametersLimitAll(endpoint)
        .then(response => {
          if (mounted_limit_parameters) {
            const data = response.payload;
            setBodyLimitParameters(data);
          }
        });
    })(endpoint_parameter_limit_all);

    (async (endpoint, option, animal_id) => {
      await getLactationNumber(endpoint, option, animal_id)
        .then(response => {
          if (mounted_lactation_no) {
            setLactationNo(response.payload[0].lactation_number);
            setValues({ "lactation_number": response.payload[0].lactation_number });
          }
        });
    })(endpoint_get_lactation_number, 1, animal_id);

    return () => {
      mounted_lookup = false;
      mounted_agents = false;
      mounted_limit_parameters = false;
      mounted_lactation_no = false;
      mounted_validations = false;
    };
  }, [organization_id, animal_id]);


  if (!colors || !deformaties || !genders || !birth_types || !calving_methods || !calving_types || !calving_ease || !calving_status || !uses_of_calf || !body_scores || !agents || !limitParameters || !lactation_number || !validations) {
    return null;
  }
  // validate weight
  let calf_weight_limits = limitParameters.filter(obj => obj.category === 'calf_weight_limits');
  let calf_weight_limits_status = false;
  let calf_weight_limits_min_value = 0;
  let calf_weight_limits_max_value = 0;
  if (calf_weight_limits.length > 0) {
    calf_weight_limits_status = calf_weight_limits[0].is_active_id;
    calf_weight_limits_min_value = calf_weight_limits[0].min_value;
    calf_weight_limits_max_value = calf_weight_limits[0].max_value;
  }
  //validate heart Girth
  let calf_heart_girth_limits = limitParameters.filter(obj => obj.category === 'calf_heart_girth_limits');
  let calf_heart_girth_limits_status = false;
  let calf_heart_girth_limits_min_value = 0;
  let calf_heart_girth_limits_max_value = 0;
  if (calf_heart_girth_limits.length > 0) {
    calf_heart_girth_limits_status = calf_heart_girth_limits[0].is_active_id;
    calf_heart_girth_limits_min_value = calf_heart_girth_limits[0].min_value;
    calf_heart_girth_limits_max_value = calf_heart_girth_limits[0].max_value;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });

    if (event.target.name === 'tag_id_option') {

      setTag('');

      if (parseInt(event.target.value) === 1) {
        setTagInputStatus(false); /** enable input on tag id field */
      } else {
        setTagInputStatus(true); /** disable input on tag id field */

        if (parseInt(event.target.value) === 2) {
          (async (endpoint, desc, org) => {
            await genericFunctionThreeParameters(endpoint, desc, org)
              .then(response => {
                setTag(response.payload[0].tag_id);
              });
          })(endpoint_gen_tag_id, 'gen tag id', organization_id);

        }

      }

    }

    if (event.target.name === 'calf_tag_id_input') {
      setTag(event.target.value);
    }

    if (event.target.name === 'tag_id_option2') {

      setTag2('');

      if (parseInt(event.target.value) === 1) {
        setTagInputStatus2(false); /** enable input on tag id field */
      } else {
        setTagInputStatus2(true); /** disable input on tag id field */

        if (parseInt(event.target.value) === 2) {
          (async (endpoint, desc, org) => {
            await genericFunctionThreeParameters(endpoint, desc, org)
              .then(response => {
                setTag2(response.payload[0].tag_id);
              });
          })(endpoint_gen_tag_id, 'gen tag id', organization_id);

        }

      }

    }

    if (event.target.name === 'calf_tag_id_input2') {
      setTag2(event.target.value);
    }

  };

  const handleSubmit = event => {

    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }

    let color_array1 = key_value_array_search(1, colors, chipsColor);
    let deformaties_array1 = key_value_array_search(1, deformaties, chipsDeformaties);

    let color_array2 = key_value_array_search(1, colors, chipsColor2);
    let deformaties_array2 = key_value_array_search(1, deformaties, chipsDeformaties2);


    (async (endpoint, id, values, user_id, lactation_number, tag_id_1, tag_id_2,colors1, deformaties1,colors2, deformaties2) => {
      await postCalving(endpoint, id, values, user_id, lactation_number, tag_id_1, tag_id_2,colors1, deformaties1,colors2, deformaties2)
        .then((response) => {

          setOutput({ status: null, message: '' });
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            if (parseInt(response.status) === 1) {
              setValues({});
              document.forms["event"].reset();
              setOutput({ status: parseInt(response.status), message: response.message })
            } else {
              setOutput({ status: parseInt(response.status), message: response.message })
            }
          }, 500);

        }).catch((error) => {
          setOutput({ status: 0, message: error.message })
          setSuccess(false);
          setLoading(false);
        });
    })(endpoint_calving_add, animal_id, values, user_id, values.lactation_number, tag, tag2,color_array1,deformaties_array1,color_array2,deformaties_array2);
  };


  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);
  };


  const handleMultiSelectChangeColor = value => {
    setChipsColor(value);
  };

  const handleMultiSelectChangeDeformaties = value => {
    setChipsDeformaties(value);
  };

  const handleChipDeleteColor = chip => {
    setChipsColor(chips => chips.filter(c => chip !== c));
  };
  const handleChipDeleteDeformaties = chip => {
    setChipsDeformaties(chips => chips.filter(c => chip !== c));
  };



  const handleMultiSelectChangeColor2 = value => {
    setChipsColor2(value);
  };

  const handleMultiSelectChangeDeformaties2 = value => {
    setChipsDeformaties2(value);
  };

  const handleChipDeleteColor2 = chip => {
    setChipsColor2(chips => chips.filter(c => chip !== c));
  };
  const handleChipDeleteDeformaties2 = chip => {
    setChipsDeformaties2(chips => chips.filter(c => chip !== c));
  };



  return (
    <Page
      className={classes.root}
      title="Calving"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {`NEW CALVING RECORD : ${animal_tag}`}
      </Typography>
      <br />
      <Header />
      <br />
      {
        (parseInt(validations.length) === 0 || override) ?
          <>
            <Grid container spacing={1} justify="center">
              <Grid item xs={1} >
                <Sidebar />
              </Grid>
              <Grid item xs={11}>
                <Card>
                  <form id='event' onSubmit={handleSubmit} >
                    <CardContent>
                      {output.status === 0 ?
                        <>
                          <Alert severity="error" >{output.message}</Alert>
                        </>
                        : output.status === 1 ?
                          <>
                            <Alert severity="success" >{output.message}</Alert>
                          </>
                          : null
                      }
                      <br />
                      <Grid
                        container
                        spacing={4}
                      >
                        <Grid
                          item
                          md={3}
                          xs={12}
                        >
                          <TextField
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              max: moment(new Date()).format('YYYY-MM-DD'),
                              min: dob
                            }}
                            required
                            label="Calving Date"
                            type="date"
                            name="calving_date"
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid
                          item
                          md={3}
                          xs={12}
                        >
                          <TextField
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            label="Lactation Number"
                            name="lactation_number"
                            onChange={handleChange}
                            variant="outlined"
                            value={values.lactation_number}
                          //defaultValue={lactation_number}
                          />
                        </Grid>
                        <Grid
                          item
                          md={3}
                          xs={12}
                        >
                          <TextField
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}

                            label="Calving Method"
                            name="calving_method"
                            onChange={handleChange}
                            required
                            default=""
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}
                            variant="outlined"
                          >
                            <option value=""></option>
                            {calving_methods.map(calving_method => (
                              <option
                                value={calving_method.id}
                              >
                                {calving_method.value}
                              </option>
                            ))
                            }
                          </TextField>
                        </Grid>
                        {parseInt(values.calving_method) === 2 ?
                          <Grid
                            item
                            md={3}
                            xs={12}
                          >
                            <TextField
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}

                              label="Assisted By"
                              name="field_agent_id"
                              onChange={handleChange}
                              variant="outlined"
                              select
                              SelectProps={{ native: true }}
                            >
                              <option value=""></option>
                              {agents.map(agent => (
                                <option
                                  value={agent.id}
                                >
                                  {agent.name}
                                </option>
                              ))
                              }
                            </TextField>
                          </Grid>
                          : null
                        }
                        <Grid
                          item
                          md={3}
                          xs={12}
                        >
                          <TextField
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}

                            label="Calving Birth Type"
                            name="calving_birth_type"
                            onChange={handleChange}
                            required
                            default=""
                            select
                            SelectProps={{ native: true }}
                            variant="outlined"
                          >
                            <option value=""></option>
                            {birth_types.map(birth_type => (
                              <option
                                value={birth_type.id}
                              >
                                {birth_type.value}
                              </option>
                            ))
                            }
                          </TextField>
                        </Grid>

                        {parseInt(values.calving_birth_type) === 1 || parseInt(values.calving_birth_type) === 2 ?
                          <Grid
                            item
                            md={12}
                            xs={12}
                          >
                            <>
                              <Card
                                {...rest}
                                className={clsx(classes.root, className)}
                                spacing={3}
                              >
                                <CardHeader title="CALF (1)" />
                                <Divider />
                                <CardContent>
                                  <Grid
                                    container
                                    spacing={4}
                                  >
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <TextField
                                        fullWidth
                                        InputLabelProps={{
                                          shrink: true
                                        }}

                                        required={true}
                                        label="Calving Status"
                                        name="calving_status"
                                        onChange={handleChange}
                                        select
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                      >
                                        <option value=""></option>
                                        {calving_status.map(status => (
                                          <option
                                            value={status.id}
                                          >
                                            {status.value}
                                          </option>
                                        ))
                                        }
                                      </TextField>
                                    </Grid>

                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <TextField
                                        fullWidth
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        required={parseInt(values.calving_status) === 1 ? true : false}

                                        label="Calving Type"
                                        name="types_calving"
                                        onChange={handleChange}
                                        default=""
                                        select
                                        // eslint-disable-next-line react/jsx-sort-props
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                      >
                                        <option value=""></option>
                                        {calving_types.map(calving_type => (
                                          <option
                                            value={calving_type.id}
                                          >
                                            {calving_type.value}
                                          </option>
                                        ))
                                        }
                                      </TextField>
                                    </Grid>
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <TextField
                                        fullWidth
                                        InputLabelProps={{
                                          shrink: true
                                        }}
                                        required={parseInt(values.calving_status) === 1 ? true : false}

                                        label="Ease Of Calving"
                                        name="ease_of_calving"
                                        onChange={handleChange}
                                        select
                                        // eslint-disable-next-line react/jsx-sort-props
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                      >
                                        <option value=""></option>
                                        {calving_ease.map(ease => (
                                          <option
                                            value={ease.id}
                                          >
                                            {ease.value}
                                          </option>
                                        ))
                                        }
                                      </TextField>
                                    </Grid>

                                    {parseInt(values.ease_of_calving) === -66 ?
                                      <Grid
                                        item
                                        md={3}
                                        xs={12}
                                      >
                                        <TextField
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}

                                          label="Ease Of Calving Other"
                                          name="ease_of_calving_other"
                                          onChange={handleChange}
                                          variant="outlined"
                                        />
                                      </Grid>
                                      : null
                                    }

                                    {
                                      parseInt(values.calving_status) === 1 &&
                                        (
                                          typeof values.ease_of_calving === 'undefined' ||
                                          parseInt(values.ease_of_calving) === 1 ||
                                          parseInt(values.ease_of_calving) === 2 ||
                                          parseInt(values.ease_of_calving) === 3 ||
                                          parseInt(values.ease_of_calving) === -66
                                        ) && (

                                          typeof values.types_calving === 'undefined' ||
                                          parseInt(values.types_calving) === 1 ||
                                          parseInt(values.types_calving) === 2
                                        )
                                        ?
                                        <>

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >

                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              required={parseInt(values.calving_status) === 1 ? true : false}
                                              label="Tag Option"
                                              name="tag_id_option"
                                              onChange={handleChange}
                                              default=""
                                              select
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              <option value="1">Input</option>
                                              <option value="2">Auto-generate</option>
                                            </TextField>
                                          </Grid>

                                          {parseInt(values.tag_id_option) === 1 &&

                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                inputProps={{
                                                  readOnly: Boolean(tagInputStatus),
                                                  disabled: Boolean(tagInputStatus)
                                                }}
                                                required={(parseInt(values.calving_status) === 1 && parseInt(values.tag_id_option) === 1) ? true : false}
                                                label="Calf Tag ID"
                                                name="calf_tag_id_input"
                                                onChange={handleChange}
                                                variant="outlined"
                                              />
                                            </Grid>
                                          }


                                          {parseInt(values.tag_id_option) === 2 &&
                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                inputProps={{
                                                  readOnly: Boolean(tagInputStatus),
                                                  disabled: Boolean(tagInputStatus)
                                                }}
                                                required={(parseInt(values.calving_status) === 1 && parseInt(values.tag_id_option) === 2) ? true : false}
                                                label="Calf Tag ID"
                                                name="calf_tag_id_auto"
                                                onChange={handleChange}
                                                variant="outlined"
                                                value={tag}

                                              />
                                            </Grid>
                                          }

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              label="Calf Name"
                                              name="calf_name"
                                              onChange={handleChange}
                                              variant="outlined"
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true
                                              }}
                                              required={parseInt(values.calving_status) === 1 ? true : false}

                                              label="Use Of Calf"
                                              name="use_of_calf"
                                              onChange={handleChange}
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {uses_of_calf.map(use => (
                                                <option
                                                  value={use.id}
                                                >
                                                  {use.value}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>
                                          {parseInt(values.use_of_calf) === -66 ?
                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}

                                                label="Other Use of Calf"
                                                name="use_of_calf_other"
                                                onChange={handleChange}
                                                variant="outlined"
                                              />
                                            </Grid>
                                            : null
                                          }
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true
                                              }}
                                              required={parseInt(values.calving_status) === 1 ? true : false}

                                              label="Calf Body Condition"
                                              name="calf_body_condition_score"
                                              onChange={handleChange}
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {body_scores.map(body_score => (
                                                <option
                                                  value={body_score.id}
                                                >
                                                  {body_score.id}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>

                                         
                                       
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              required={parseInt(values.calving_status) === 1 ? true : false}

                                              label="Calf Sex"
                                              name="calf_gender"
                                              onChange={handleChange}
                                              default=""
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {genders.map(gender => (
                                                <option
                                                  value={gender.id}
                                                >
                                                  {gender.value}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              inputProps={{
                                                min: (calf_weight_limits_status) ? calf_weight_limits_min_value : "any",
                                                max: (calf_weight_limits_status) ? calf_weight_limits_max_value : "any",
                                                step: "any"
                                              }}
                                              //required={parseInt(values.calving_status) === 1 ? true : false}
                                              type="number"
                                              label="Calf Weight(kg)"
                                              name="Calf_weight"
                                              onChange={handleChange}
                                              variant="outlined"
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              inputProps={{
                                                min: (calf_heart_girth_limits_status) ? calf_heart_girth_limits_min_value : "any",
                                                max: (calf_heart_girth_limits_status) ? calf_heart_girth_limits_max_value : "any",
                                                step: "any"
                                              }}
                                              type="number"

                                              label="Calf Heart Girth(cm)"
                                              name="calf_heart_girth"
                                              onChange={handleChange}
                                              variant="outlined"
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            md={12}
                                            xs={12}
                                          >
                                            <Grid
                                              container
                                              spacing={2}
                                            >
                                              <Grid
                                                item
                                                md={6}
                                                xs={12}
                                              >
                                                <Card
                                                  {...rest}
                                                  className={clsx(classes.root, className)}
                                                >
                                                  <div className={classes.chips}>
                                                    {chipsDeformaties.map(chip => (
                                                      <Chip
                                                        className={classes.chip}
                                                        deleteIcon={<CloseIcon />}
                                                        key={chip}
                                                        label={chip}
                                                        onDelete={() => handleChipDeleteDeformaties(chip)}
                                                      />
                                                    ))}
                                                  </div>
                                                  <Divider />
                                                  <div className={classes.selects}>
                                                    <MultiSelect
                                                      key='Deformaties'
                                                      label="Deformaties"
                                                      onChange={handleMultiSelectChangeDeformaties}
                                                      options={deformatiesValueAttribute}
                                                      value={chipsDeformaties}
                                                    />
                                                  </div>
                                                </Card>
                                              </Grid>

                                              <Grid
                                                item
                                                md={6}
                                                xs={12}
                                              >
                                                <Card
                                                  {...rest}
                                                  className={clsx(classes.root, className)}
                                                >
                                                  <div className={classes.chips}>
                                                    {chipsColor.map(chip => (
                                                      <Chip
                                                        className={classes.chip}
                                                        deleteIcon={<CloseIcon />}
                                                        key={chip}
                                                        label={chip}
                                                        onDelete={() => handleChipDeleteColor(chip)}
                                                      />
                                                    ))}
                                                  </div>
                                                  <Divider />
                                                  <div className={classes.selects}>
                                                    <MultiSelect
                                                      key='colors'
                                                      label="Colors"
                                                      onChange={handleMultiSelectChangeColor}
                                                      options={colorsValueAttribute}
                                                      value={chipsColor}
                                                    />
                                                  </div>
                                                </Card>
                                              </Grid>

                                            </Grid>
                                          </Grid>


                                        </>
                                        : null
                                    }
                                  </Grid>
                                  <br /><br />
                                </CardContent>
                              </Card>

                              <br />
                              <br />

                              {parseInt(values.calving_birth_type) === 2 ?
                                <Card
                                  {...rest}
                                  className={clsx(classes.root, className)}
                                  spacing={3}
                                >
                                  <CardHeader title="CALF(2)" />
                                  <Divider />
                                  <CardContent>
                                    <Grid
                                      container
                                      spacing={4}
                                    >

                                      <Grid
                                        item
                                        md={3}
                                        xs={12}
                                      >
                                        <TextField
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true
                                          }}
                                          required={parseInt(values.calving_birth_type) === 1 ? false : true}

                                          label="Calving Status"
                                          name="calving_status2"
                                          onChange={handleChange}
                                          select
                                          // eslint-disable-next-line react/jsx-sort-props
                                          SelectProps={{ native: true }}
                                          variant="outlined"
                                        >
                                          <option value=""></option>
                                          {calving_status.map(status => (
                                            <option
                                              value={status.id}
                                            >
                                              {status.value}
                                            </option>
                                          ))
                                          }
                                        </TextField>
                                      </Grid>

                                      <Grid
                                        item
                                        md={3}
                                        xs={12}
                                      >
                                        <TextField
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          required={parseInt(values.calving_status2) === 1 ? true : false}

                                          label="Calving Type"
                                          name="types_calving2"
                                          onChange={handleChange}
                                          default=""
                                          select
                                          // eslint-disable-next-line react/jsx-sort-props
                                          SelectProps={{ native: true }}
                                          variant="outlined"
                                        >
                                          <option value=""></option>
                                          {calving_types.map(calving_type => (
                                            <option
                                              value={calving_type.id}
                                            >
                                              {calving_type.value}
                                            </option>
                                          ))
                                          }
                                        </TextField>
                                      </Grid>
                                      <Grid
                                        item
                                        md={3}
                                        xs={12}
                                      >
                                        <TextField
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true
                                          }}
                                          required={parseInt(values.calving_status2) === 1 ? true : false}

                                          label="Ease Of Calving"
                                          name="ease_of_calving2"
                                          onChange={handleChange}
                                          select
                                          // eslint-disable-next-line react/jsx-sort-props
                                          SelectProps={{ native: true }}
                                          variant="outlined"
                                        >
                                          <option value=""></option>
                                          {calving_ease.map(ease => (
                                            <option
                                              value={ease.id}
                                            >
                                              {ease.value}
                                            </option>
                                          ))
                                          }
                                        </TextField>
                                      </Grid>

                                      {parseInt(values.ease_of_calving2) === -66 ?
                                        <Grid
                                          item
                                          md={3}
                                          xs={12}
                                        >
                                          <TextField
                                            fullWidth
                                            InputLabelProps={{
                                              shrink: true,
                                            }}

                                            label="Ease Of Calving Other"
                                            name="ease_of_calving_other2"
                                            onChange={handleChange}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        : null
                                      }



                                      {parseInt(values.calving_status2) === 1 &&
                                        (
                                          typeof values.ease_of_calving2 === 'undefined' ||
                                          parseInt(values.ease_of_calving2) === 1 ||
                                          parseInt(values.ease_of_calving2) === 2 ||
                                          parseInt(values.ease_of_calving2) === 3 ||
                                          parseInt(values.ease_of_calving2) === -66
                                        ) &&
                                        (
                                          typeof values.types_calving2 === 'undefined' ||
                                          parseInt(values.types_calving2) === 1 ||
                                          parseInt(values.types_calving2) === 2
                                        )
                                        ?
                                        <>

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >

                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              required={parseInt(values.calving_status2) === 1 ? true : false}
                                              label="Tag Option"
                                              name="tag_id_option2"
                                              onChange={handleChange}
                                              default=""
                                              select
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              <option value="1">Input</option>
                                              <option value="2">Auto-generate</option>
                                            </TextField>
                                          </Grid>

                                          {parseInt(values.tag_id_option2) === 1 &&

                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                inputProps={{
                                                  readOnly: Boolean(tagInputStatus2),
                                                  disabled: Boolean(tagInputStatus2)
                                                }}
                                                required={(parseInt(values.calving_status2) === 1 && parseInt(values.tag_id_option2) === 1) ? true : false}
                                                label="Calf Tag ID"
                                                name="calf_tag_id_input2"
                                                onChange={handleChange}
                                                variant="outlined"
                                              />
                                            </Grid>
                                          }



                                          {parseInt(values.tag_id_option2) === 2 &&
                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                inputProps={{
                                                  readOnly: Boolean(tagInputStatus2),
                                                  disabled: Boolean(tagInputStatus2)
                                                }}
                                                required={(parseInt(values.calving_status2) === 1 && parseInt(values.tag_id_option2) === 2) ? true : false}
                                                label="Calf Tag ID"
                                                name="calf_tag_id_auto2"
                                                onChange={handleChange}
                                                variant="outlined"
                                                value={tag2}

                                              />
                                            </Grid>
                                          }

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              label="Calf Name"
                                              name="calf_name2"
                                              onChange={handleChange}
                                              variant="outlined"
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true
                                              }}
                                              required={parseInt(values.calving_status2) === 1 ? true : false}

                                              label="Use Of Calf"
                                              name="use_of_calf2"
                                              onChange={handleChange}
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {uses_of_calf.map(use => (
                                                <option
                                                  value={use.id}
                                                >
                                                  {use.value}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>
                                          {parseInt(values.use_of_calf2) === -66 ?
                                            <Grid
                                              item
                                              md={3}
                                              xs={12}
                                            >
                                              <TextField
                                                fullWidth
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}

                                                label="Other Use of Calf"
                                                name="use_of_calf_other2"
                                                onChange={handleChange}
                                                variant="outlined"
                                              />
                                            </Grid>
                                            : null
                                          }
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true
                                              }}
                                              required={parseInt(values.calving_status2) === 1 ? true : false}

                                              label="Calf Body Condition"
                                              name="calf_body_condition_score2"
                                              onChange={handleChange}
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {body_scores.map(body_score => (
                                                <option
                                                  value={body_score.id}
                                                >
                                                  {body_score.id}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>

                                          
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              required={parseInt(values.calving_status2) === 1 ? true : false}

                                              label="Calf Sex"
                                              name="calf_gender2"
                                              onChange={handleChange}
                                              default=""
                                              select
                                              // eslint-disable-next-line react/jsx-sort-props
                                              SelectProps={{ native: true }}
                                              variant="outlined"
                                            >
                                              <option value=""></option>
                                              {genders.map(gender => (
                                                <option
                                                  value={gender.id}
                                                >
                                                  {gender.value}
                                                </option>
                                              ))
                                              }
                                            </TextField>
                                          </Grid>
                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}

                                              inputProps={{
                                                min: (calf_weight_limits_status) ? calf_weight_limits_min_value : "any",
                                                max: (calf_weight_limits_status) ? calf_weight_limits_max_value : "any",
                                                step: "any"
                                              }}
                                              // required={parseInt(values.calving_status2) === 1 ? true : false}
                                              type="number"
                                              label="Calf Weight(kg)"
                                              name="Calf_weight2"
                                              onChange={handleChange}
                                              variant="outlined"
                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            md={3}
                                            xs={12}
                                          >
                                            <TextField
                                              fullWidth
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              inputProps={{
                                                min: (calf_heart_girth_limits_status) ? calf_heart_girth_limits_min_value : "any",
                                                max: (calf_heart_girth_limits_status) ? calf_heart_girth_limits_max_value : "any",
                                                step: "any"
                                              }}
                                              type="number"

                                              label="Calf Heart Girth(cm)"
                                              name="calf_heart_girth2"
                                              onChange={handleChange}
                                              variant="outlined"

                                            />
                                          </Grid>

                                          <Grid
                                            item
                                            md={12}
                                            xs={12}
                                          >
                                            <Grid
                                              container
                                              spacing={2}
                                            >
                                              <Grid
                                                item
                                                md={6}
                                                xs={12}
                                              >
                                                <Card
                                                  {...rest}
                                                  className={clsx(classes.root, className)}
                                                >
                                                  <div className={classes.chips}>
                                                    {chipsDeformaties2.map(chip => (
                                                      <Chip
                                                        className={classes.chip}
                                                        deleteIcon={<CloseIcon />}
                                                        key={chip}
                                                        label={chip}
                                                        onDelete={() => handleChipDeleteDeformaties2(chip)}
                                                      />
                                                    ))}
                                                  </div>
                                                  <Divider />
                                                  <div className={classes.selects}>
                                                    <MultiSelect
                                                      key='Deformaties'
                                                      label="Deformaties"
                                                      onChange={handleMultiSelectChangeDeformaties2}
                                                      options={deformatiesValueAttribute2}
                                                      value={chipsDeformaties2}
                                                    />
                                                  </div>
                                                </Card>
                                              </Grid>

                                              <Grid
                                                item
                                                md={6}
                                                xs={12}
                                              >
                                                <Card
                                                  {...rest}
                                                  className={clsx(classes.root, className)}
                                                >
                                                  <div className={classes.chips}>
                                                    {chipsColor2.map(chip => (
                                                      <Chip
                                                        className={classes.chip}
                                                        deleteIcon={<CloseIcon />}
                                                        key={chip}
                                                        label={chip}
                                                        onDelete={() => handleChipDeleteColor2(chip)}
                                                      />
                                                    ))}
                                                  </div>
                                                  <Divider />
                                                  <div className={classes.selects}>
                                                    <MultiSelect
                                                      key='colors'
                                                      label="Colors"
                                                      onChange={handleMultiSelectChangeColor2}
                                                      options={colorsValueAttribute2}
                                                      value={chipsColor2}
                                                    />
                                                  </div>
                                                </Card>
                                              </Grid>

                                            </Grid>
                                          </Grid>

                                        </>
                                        : null
                                      }
                                    </Grid>
                                  </CardContent>
                                </Card>
                                : null
                              }

                            </>
                          </Grid>

                          : null
                        }


                      </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <div className={classes.wrapper}>
                        <Fab
                          aria-label="save"
                          color="primary"
                          className={buttonClassname}
                        >
                          {success ? <CheckIcon /> : <SaveIcon />}
                        </Fab>
                        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                      </div>
                      <div className={classes.wrapper}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={buttonClassname}
                          disabled={loading}
                          type="submit"
                        >
                          Save Changes
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                    </CardActions>
                  </form>
                </Card>
              </Grid>
            </Grid>
          </>
          : <EventValidation validations={validations} />
      }
      <Grid container spacing={1} justify="center">
        <Grid item xs={12} >
          {parseInt(validations.length) === 0 || override ? null :
            <>
              <Box>
                <Typography variant="h6"> Override Validations </Typography>
              </Box>
              <Box>
                <Switch
                  className={classes.toggle}
                  // checked={values.readOnly}
                  color="secondary"
                  edge="start"
                  onChange={handleSwitchChange}
                />
              </Box>
            </>
          }
        </Grid>
      </Grid>
    </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
